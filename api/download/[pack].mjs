import { createHmac, timingSafeEqual } from 'node:crypto';

const archiveEnv = {
  cloud: 'ARCHIVE_URL_1',
  1: 'ARCHIVE_URL_1',
  2: 'ARCHIVE_URL_2',
  3: 'ARCHIVE_URL_3',
  4: 'ARCHIVE_URL_4',
};

export default function handler(req, res) {
  const pack = req.query?.pack;
  const token = String(req.query?.token || '');
  const [encodedPayload, signature] = token.split('.');
  if (!archiveEnv[pack] || !encodedPayload || !signature) return res.status(403).json({ error: 'Invalid download link' });

  try {
    const payload = Buffer.from(encodedPayload, 'base64url').toString();
    const [tokenPack, expires] = payload.split('.');
    const expected = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(payload).digest('hex');
    const validSignature = expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (tokenPack !== pack || !validSignature || Number(expires) < Date.now()) return res.status(403).json({ error: 'Download link expired' });

    const archiveUrl = process.env[archiveEnv[pack]];
    if (!archiveUrl) return res.status(503).json({ error: 'Archive storage is not configured yet' });
    return res.redirect(302, archiveUrl);
  } catch {
    return res.status(403).json({ error: 'Invalid download link' });
  }
}
