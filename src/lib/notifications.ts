import "server-only";

/**
 * Both functions are safe no-ops if their env vars aren't set, so you
 * can enable email only, WhatsApp only, both, or neither — nothing
 * else in the app depends on them.
 */

interface OrderNotificationData {
  orderNumber: string;
  fullName: string;
  phone: string;
  email?: string | null;
  total: number;
  items: { product_name: string; quantity: number; unit_price: number }[];
}

// ---------------------------------------------------------------------
// EMAIL — via Resend (https://resend.com). Free tier is enough to start.
// ---------------------------------------------------------------------
export async function sendOrderConfirmationEmail(data: OrderNotificationData) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || !data.email) return;

  const itemsHtml = data.items
    .map((i) => `<li>${i.product_name} × ${i.quantity} — ${i.unit_price * i.quantity} دج</li>`)
    .join("");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: data.email,
        subject: `تأكيد طلبك ${data.orderNumber}`,
        html: `
          <div dir="rtl" style="font-family:sans-serif">
            <h2>تم تسجيل طلبك بنجاح 🎉</h2>
            <p>رقم الطلب: <strong>${data.orderNumber}</strong></p>
            <ul>${itemsHtml}</ul>
            <p>المجموع: <strong>${data.total} دج</strong></p>
            <p>سنتواصل معك على ${data.phone} لتأكيد الطلب.</p>
          </div>
        `,
      }),
    });
  } catch (err) {
    // Never let a failed notification break the checkout flow.
    console.error("sendOrderConfirmationEmail failed", err);
  }
}

// ---------------------------------------------------------------------
// WHATSAPP — via Twilio's WhatsApp API (https://twilio.com/whatsapp)
// You need: a Twilio account, WhatsApp sender approved/sandbox, and
// the customer's number in E.164 format (e.g. +2135XXXXXXXX).
// ---------------------------------------------------------------------
export async function sendOrderConfirmationWhatsApp(data: OrderNotificationData) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
  if (!sid || !token || !from) return;

  // Algerian local numbers (0xxxxxxxxx) -> E.164 (+213xxxxxxxxx)
  const e164 = data.phone.startsWith("0") ? `+213${data.phone.slice(1)}` : data.phone;

  const body = `تم تسجيل طلبك بنجاح 🎉\nرقم الطلب: ${data.orderNumber}\nالمجموع: ${data.total} دج\nسنتصل بك قريبًا لتأكيد الطلب.`;

  try {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: from,
        To: `whatsapp:${e164}`,
        Body: body,
      }),
    });
  } catch (err) {
    console.error("sendOrderConfirmationWhatsApp failed", err);
  }
}
