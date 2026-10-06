const PRICE_PAISE = 40000; // ₹400 INR (Discounted from ₹2,000)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return res.status(500).json({ error: 'Razorpay environment variables are missing on Vercel' });

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: PRICE_PAISE,
        currency: 'INR',
        receipt: `kinetic_${Date.now()}`,
        notes: { product: 'Kinetic UI Awwwards Motion Pack (₹400 Lifetime Access)' },
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.description || 'Razorpay order create failed' });
    return res.status(200).json({ keyId, orderId: data.id, amount: data.amount, currency: data.currency });
  } catch {
    return res.status(500).json({ error: 'Could not connect to Razorpay' });
  }
}
