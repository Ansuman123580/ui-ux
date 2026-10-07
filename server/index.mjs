import { createServer } from 'node:http';
import { createHmac, randomBytes } from 'node:crypto';
import { createReadStream, existsSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { sendPurchaseEmail } from './mailer.mjs';

const PORT = Number(process.env.PORT || 8787);
const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const PRICE_PAISE = 100; // ₹1 INR test
const ARCHIVE_URL = process.env.ARCHIVE_URL_1 || 'https://drive.google.com/uc?export=download&id=1GNoRaPyKir7CWuNUz8XGi00P6cdCdVrU';

const MAX_DOWNLOADS = 3; // Maximum allowed downloads per token
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours expiry
const TOKENS_FILE = join(process.cwd(), 'server', 'download_tokens.json');

if (!KEY_ID || !KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured in .env');
}

// Persistent token storage so restarts don't invalidate buyer downloads
const loadTokens = () => {
  try {
    if (existsSync(TOKENS_FILE)) {
      const data = JSON.parse(readFileSync(TOKENS_FILE, 'utf8'));
      return new Map(Object.entries(data));
    }
  } catch (err) {
    console.error('[TOKEN STORE] Failed to read tokens file:', err);
  }
  return new Map();
};

const saveTokens = (tokensMap) => {
  try {
    const plain = Object.fromEntries(tokensMap);
    writeFileSync(TOKENS_FILE, JSON.stringify(plain, null, 2), 'utf8');
  } catch (err) {
    console.error('[TOKEN STORE] Failed to save tokens file:', err);
  }
};

const orders = new Map();
const downloadTokens = loadTokens();

const getToken = (tokenStr) => {
  if (!tokenStr) return null;
  let tokenData = downloadTokens.get(tokenStr);
  if (!tokenData && existsSync(TOKENS_FILE)) {
    try {
      const data = JSON.parse(readFileSync(TOKENS_FILE, 'utf8'));
      for (const [k, v] of Object.entries(data)) {
        downloadTokens.set(k, v);
      }
      tokenData = downloadTokens.get(tokenStr);
    } catch {}
  }
  return tokenData;
};

const send = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
};

const sendHtmlError = (res, title, message, subtext = '') => {
  res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090d; color: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { max-width: 520px; width: 100%; background: #12131a; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 20px; padding: 36px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); text-align: center; }
    .icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #f87171; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 20px; border: 1px solid rgba(239, 68, 68, 0.3); }
    h2 { font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 12px 0; }
    p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0; }
    .sub { font-family: monospace; font-size: 12px; color: #71717a; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px; border-radius: 10px; margin-top: 20px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🚫</div>
    <h2>${title}</h2>
    <p>${message}</p>
    ${subtext ? `<div class="sub">${subtext}</div>` : ''}
  </div>
</body>
</html>
  `);
};

const readBody = async (req) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
};

const razorpayRequest = async (path, body) => {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.description || 'Razorpay request failed');
  return data;
};

const findZipFile = () => {
  const candidates = [
    join(process.cwd(), 'hero-animations.zip'),
    join(process.cwd(), 'Awwwards-Motion-Pack.zip'),
    join(process.env.DOWNLOAD_ARCHIVE_DIR || '', 'hero-animations.zip'),
    join(process.env.DOWNLOAD_ARCHIVE_DIR || '', 'Awwwards-Motion-Pack.zip'),
  ];
  for (const c of candidates) {
    if (c && existsSync(c)) return c;
  }
  return null;
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return send(res, 204, {});

  try {
    if (req.method === 'POST' && url.pathname === '/api/create-order') {
      const order = await razorpayRequest('/orders', {
        amount: PRICE_PAISE,
        currency: 'INR',
        receipt: `obsidian_${Date.now()}`,
        notes: { product: 'Obsidian Motion Awwwards Vault (₹400 Lifetime Access)' },
      });
      orders.set(order.id, { createdAt: Date.now() });
      return send(res, 200, { keyId: KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency });
    }

    if (req.method === 'POST' && url.pathname === '/api/verify-payment') {
      const body = await readBody(req);
      const order = orders.get(body.razorpay_order_id);
      if (!order || Date.now() - order.createdAt > 30 * 60 * 1000) return send(res, 400, { error: 'Order expired or invalid' });
      const signature = createHmac('sha256', KEY_SECRET)
        .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
        .digest('hex');
      if (signature !== body.razorpay_signature) return send(res, 400, { error: 'Payment verification failed' });
      
      const userEmail = body.email || body.notes?.customer_email || 'unspecified@customer.com';
      const token = randomBytes(32).toString('hex');
      
      const tokenData = {
        createdAt: Date.now(),
        orderId: body.razorpay_order_id,
        paymentId: body.razorpay_payment_id,
        email: userEmail,
        maxDownloads: MAX_DOWNLOADS,
        downloadCount: 0,
        ips: [],
      };
      
      downloadTokens.set(token, tokenData);
      saveTokens(downloadTokens);
      
      // Both downloads are securely tokenized with zero public exposure of the raw Drive link!
      const downloads = [
        {
          name: 'Obsidian Motion Full Archive — Direct Digital Download (Complete Pack)',
          url: `/api/download/cloud?token=${token}`,
        },
        {
          name: 'Hero Animations Pack — Direct Server Download (309 MB)',
          url: `/api/download/1?token=${token}`,
        },
      ];

      const clientHost = req.headers.host ? `http://${req.headers.host}` : 'http://localhost:5173';
      let mailStatus = { sent: false, reason: 'No email provided' };

      if (userEmail) {
        mailStatus = await sendPurchaseEmail({
          toEmail: userEmail,
          paymentId: body.razorpay_payment_id,
          orderId: body.razorpay_order_id,
          downloadUrls: downloads,
          baseUrl: clientHost,
        });
      }

      return send(res, 200, {
        success: true,
        downloads,
        emailSent: mailStatus.sent,
        emailTarget: userEmail,
        maxDownloads: MAX_DOWNLOADS,
        mailStatus,
      });
    }

    // Protected Download Handler with Download Limit & Expiry Check
    const isCloudDownload = url.pathname === '/api/download/cloud';
    const isLocalDownload = /^\/api\/download\/[1-4]$/.test(url.pathname);

    if (req.method === 'GET' && (isCloudDownload || isLocalDownload)) {
      const tokenStr = url.searchParams.get('token');
      const tokenData = getToken(tokenStr);

      if (!tokenData) {
        return sendHtmlError(
          res,
          'Access Denied (Invalid Link)',
          'This download link is invalid or does not exist on the server.',
          `Token: ${tokenStr || 'missing'}`
        );
      }

      // 1. Time Expiry Check (24 hours)
      if (Date.now() - tokenData.createdAt > TOKEN_TTL_MS) {
        return sendHtmlError(
          res,
          'Link Expired ⏳',
          'This download link has expired (24-hour validity limit). Please contact support if you need your access reopened.',
          `Order ID: ${tokenData.orderId || 'N/A'}`
        );
      }

      // 2. Download Limit Check (Max 3 Downloads)
      if (tokenData.downloadCount >= tokenData.maxDownloads) {
        return sendHtmlError(
          res,
          'Download Limit Exceeded 🚫',
          `You have reached the maximum allowed downloads (${tokenData.maxDownloads}/${tokenData.maxDownloads}) for this license. To protect against unauthorized sharing and piracy, this link has been permanently deactivated.`,
          `Licensed to: ${tokenData.email} • Order: ${tokenData.orderId}`
        );
      }

      // Increment download counter and record IP
      tokenData.downloadCount += 1;
      const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString();
      tokenData.ips = tokenData.ips || [];
      if (!tokenData.ips.includes(clientIp)) {
        tokenData.ips.push(clientIp);
      }
      saveTokens(downloadTokens);

      console.log(`[SECURITY] 🛡️ Download approved (${tokenData.downloadCount}/${tokenData.maxDownloads}) for ${tokenData.email} from IP: ${clientIp}`);

      // Case A: Cloud Mirror Download (Google Drive 302 Private Redirect)
      if (isCloudDownload) {
        res.writeHead(302, {
          'Location': ARCHIVE_URL,
          'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        });
        return res.end();
      }

      // Case B: Local Server ZIP Download (Streams hero-animations.zip)
      const zipPath = findZipFile();
      if (!zipPath) return send(res, 404, { error: 'ZIP Archive not found on server' });

      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': statSync(zipPath).size,
        'Content-Disposition': `attachment; filename="${basename(zipPath)}"`,
        'Cache-Control': 'private, no-store',
      });
      return createReadStream(zipPath).pipe(res);
    }

    send(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error('[SERVER ERROR]', error);
    send(res, 500, { error: error.message || 'Payment service error' });
  }
});

server.listen(PORT, () => console.log(`Payment server listening on http://localhost:${PORT}`));
