import { createHmac, timingSafeEqual } from 'node:crypto';
import { sendPurchaseEmail } from '../server/mailer.mjs';

const PRICE_PAISE = 40000; // ₹400 INR (Discounted from ₹2,000)

const signDownload = (pack) => {
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  const payload = `${pack}.${expires}`;
  const signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: paymentSignature, email } = req.body || {};
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !orderId || !paymentId || !paymentSignature) return res.status(400).json({ error: 'Incomplete payment response' });

  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  const valid = expected.length === paymentSignature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(paymentSignature));
  if (!valid) return res.status(400).json({ error: 'Payment verification failed' });

  try {
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${secret}`).toString('base64');
    const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, { headers: { Authorization: `Basic ${auth}` } });
    const order = await orderResponse.json();
    if (!orderResponse.ok || order.amount !== PRICE_PAISE || order.currency !== 'INR') {
      return res.status(400).json({ error: 'Order amount verification failed' });
    }

    const downloads = [
      {
        name: 'Google Drive Cloud Mirror (Complete 5GB+ Motion Pack)',
        url: `/api/download/cloud?token=${signDownload('cloud')}`,
      },
      {
        name: 'Hero Animations Pack — Direct Server Download (309 MB)',
        url: `/api/download/1?token=${signDownload(1)}`,
      }
    ];

    let mailStatus = { sent: false, reason: 'No email provided' };
    if (email) {
      mailStatus = await sendPurchaseEmail({
        toEmail: email,
        paymentId,
        orderId,
        downloadUrls: downloads,
      });
    }

    return res.status(200).json({
      success: true,
      downloads,
      emailSent: mailStatus.sent,
      emailTarget: email,
      mailStatus,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not verify order with Razorpay' });
  }
}
