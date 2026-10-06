import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

export const sendPurchaseEmail = async ({ toEmail, paymentId, orderId, downloadUrls = [], baseUrl = 'http://localhost:5173' }) => {
  const transporter = getTransporter();

  const formattedUrls = downloadUrls.map((d) => ({
    name: d.name,
    url: d.url.startsWith('http') ? d.url : `${baseUrl}${d.url}`,
  }));

  const primaryDownload = formattedUrls[0] || { name: 'Download Motion Pack', url: baseUrl };

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Obsidian Motion Pro Pack is Ready</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08090d; color: #f4f4f5; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #0f1117; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
    .badge { display: inline-block; background: rgba(0, 242, 254, 0.1); color: #00f2fe; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-family: monospace; font-weight: bold; border: 1px solid rgba(0, 242, 254, 0.3); text-transform: uppercase; margin-bottom: 16px; }
    h1 { color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 12px 0; }
    p { color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #00f2fe, #4facfe); color: #08090d !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin: 16px 0 24px 0; }
    .box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px; color: #71717a; }
    .box span { color: #e4e4e7; }
    .security-box { background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 16px; margin: 24px 0; }
    .footer { font-size: 11px; color: #52525b; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Payment Confirmed • Single-User License</div>
    <h1>Thank you for your purchase! ⚡</h1>
    <p>Your access to the <strong>Obsidian Motion — Awwwards Motion &amp; Component Vault</strong> is ready. This package includes all production-grade motion studies, source files, and React components.</p>
    
    <div style="text-align: center;">
      <a href="${primaryDownload.url}" class="btn" target="_blank">📥 ${primaryDownload.name}</a>
    </div>

    ${formattedUrls.length > 1 ? `
    <p style="font-weight: 600; color: #fff; margin-bottom: 8px;">Secure Digital Downloads &amp; Archives:</p>
    <ul style="padding-left: 20px;">
      ${formattedUrls.map(d => `<li style="margin-bottom: 10px;"><a href="${d.url}" style="color: #00f2fe; text-decoration: underline; font-size: 13px;">${d.name}</a></li>`).join('')}
    </ul>
    ` : ''}

    <div class="security-box">
      <div style="color: #f87171; font-weight: bold; font-size: 13px; margin-bottom: 6px;">
        🔒 Anti-Piracy &amp; Download Limit Notice:
      </div>
      <p style="color: #d4d4d8; font-size: 12px; line-height: 1.5; margin: 0;">
        This download link is cryptographically tied to your email (<strong>${toEmail}</strong>). 
        This link permits a <strong>maximum of 3 downloads</strong> (valid for 24 hours). 
        Please do not distribute or share this link publicly — once 3 downloads are reached, the link is permanently deactivated.
      </p>
    </div>

    <div class="box">
      <div>Order ID: <span>${orderId || 'Direct'}</span></div>
      <div style="margin-top: 4px;">Payment ID: <span>${paymentId || 'Verified'}</span></div>
      <div style="margin-top: 4px;">Licensed To: <span>${toEmail}</span></div>
      <div style="margin-top: 4px;">Allowed Downloads: <span>Max 3 times (24h validity)</span></div>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Obsidian Motion Studio. Protected by dynamic token validation.
    </div>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    console.log(`[MAILER] ⚠️ SMTP credentials not configured in .env.`);
    console.log(`[MAILER] 📧 Email would be dispatched to: ${toEmail}`);
    console.log(`[MAILER] 🔗 Tokenized secure links:`, formattedUrls.map(u => u.url));
    return {
      sent: false,
      reason: 'SMTP not configured in .env (Direct token links active)',
      formattedUrls,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Obsidian Motion" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: '⚡ [Secure Access] Your Obsidian Motion Pro Pack (Max 3 Downloads)',
      text: `Thank you for purchasing Obsidian Motion Pro Pack!\n\nYour protected download link: ${primaryDownload.url}\n\nNote: Maximum 3 downloads allowed within 24 hours. Do not share this link.\n\nOrder ID: ${orderId}\nPayment ID: ${paymentId}`,
      html: htmlContent,
    });

    console.log(`[MAILER] ✅ Email sent to ${toEmail} (MessageId: ${info.messageId})`);
    return {
      sent: true,
      messageId: info.messageId,
      formattedUrls,
    };
  } catch (error) {
    console.error(`[MAILER] ❌ Failed to send email to ${toEmail}:`, error);
    return {
      sent: false,
      error: error.message,
      formattedUrls,
    };
  }
};
