import { createServer } from 'node:http';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const PORT = Number(process.env.PORT || 8787);
const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const ARCHIVE_DIR = process.env.DOWNLOAD_ARCHIVE_DIR || '/Users/ansumanmaharana/Downloads/codesss';
const ARCHIVES = [
  'Awwwards Pack-20260905T072525Z-1-001.zip',
  'Awwwards Pack-20260905T072525Z-1-002.zip',
  'Awwwards Pack-20260905T072525Z-1-003.zip',
  'Awwwards Pack-20260905T072525Z-1-004.zip',
];

if (!KEY_ID || !KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured in .env');
}

const orders = new Map();
const downloadTokens = new Map();

const send = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
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

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return send(res, 204, {});

  try {
    if (req.method === 'POST' && url.pathname === '/api/create-order') {
      const order = await razorpayRequest('/orders', {
        amount: 100000,
        currency: 'INR',
        receipt: `kinetic_${Date.now()}`,
        notes: { product: 'Kinetic UI Awwwards Pack' },
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
      const token = randomBytes(32).toString('hex');
      downloadTokens.set(token, { createdAt: Date.now(), orderId: body.razorpay_order_id });
      return send(res, 200, {
        downloads: ARCHIVES.map((archive, index) => ({
          name: archive,
          url: `/api/download/${index + 1}?token=${token}`,
        })),
      });
    }

    const downloadMatch = url.pathname.match(/^\/api\/download\/([1-4])$/);
    if (req.method === 'GET' && downloadMatch) {
      const token = downloadTokens.get(url.searchParams.get('token'));
      if (!token || Date.now() - token.createdAt > 24 * 60 * 60 * 1000) return send(res, 403, { error: 'Download link expired' });
      const archive = join(ARCHIVE_DIR, ARCHIVES[Number(downloadMatch[1]) - 1]);
      if (!existsSync(archive)) return send(res, 404, { error: 'Archive is not configured on this server' });
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': statSync(archive).size,
        'Content-Disposition': `attachment; filename="${basename(archive)}"`,
        'Cache-Control': 'private, no-store',
      });
      return createReadStream(archive).pipe(res);
    }

    send(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    send(res, 500, { error: 'Payment service error' });
  }
});

server.listen(PORT, () => console.log(`Payment server listening on http://localhost:${PORT}`));
