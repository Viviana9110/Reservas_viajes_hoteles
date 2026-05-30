import nodemailer from "nodemailer";
import twilio from "twilio";

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

export const buildWaMeLink = (phone, message) => {
  const cleaned = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
};

const EMAIL_TEMPLATE = (data) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:Outfit,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:24px">
    <tr><td style="text-align:center;padding:24px 0">
      <h1 style="color:#0F172A;font-size:22px;margin:0">🌍 Tour Colombia</h1>
    </td></tr>
    <tr><td style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 12px rgba(0,0,0,.06)">
      <h2 style="color:#0F172A;font-size:20px;margin:0 0 4px">¡Gracias por tu reserva!</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 20px">Hola <strong style="color:#0F172A">${data.name}</strong>, aquí están los detalles:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:16px">
        ${data.items.map((item) => `
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#64748b;width:90px">${item.label}</td>
          <td style="padding:6px 0;font-size:13px;color:#0F172A;font-weight:600">${item.value}</td>
        </tr>`).join("")}
      </table>

      ${data.extra ? `<p style="color:#64748b;font-size:13px;margin:16px 0 0">${data.extra}</p>` : ""}

      ${data.waLink ? `
      <div style="margin-top:20px;padding:16px;background:#e8f5e9;border-radius:12px;text-align:center">
        <p style="color:#2e7d32;font-size:13px;margin:0 0 8px">Recibe la confirmación por WhatsApp</p>
        <a href="${data.waLink}" target="_blank" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:10px 20px;border-radius:24px;font-size:13px;font-weight:600">
          💬 Abrir WhatsApp
        </a>
      </div>` : ""}

      <p style="color:#94a3b8;font-size:12px;margin-top:20px;text-align:center">Tour Colombia — Viajes que transforman 🌎</p>
    </td></tr>
  </table>
</body>
</html>`;

export const sendEmailNotification = async (userEmail, userName, items, extra) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("⚠️ EMAIL_USER/EMAIL_PASS no configurados en .env");
    return false;
  }

  const waLink = process.env.OWNER_WHATSAPP
    ? buildWaMeLink(process.env.OWNER_WHATSAPP, `Hola Tour Colombia, quiero confirmar mi reserva:\n${items.map((i) => `${i.label}: ${i.value}`).join("\n")}`)
    : null;

  try {
    await transporter.sendMail({
      from: `"Tour Colombia" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Confirmación de tu reserva ✈️",
      html: EMAIL_TEMPLATE({ name: userName, items, extra, waLink }),
    });
    console.log("📧 Correo enviado a:", userEmail);
    return true;
  } catch (err) {
    console.error("❌ Error al enviar correo:", err.message);
    return false;
  }
};

export const sendWhatsAppNotification = async (phoneNumber, message) => {
  const client = getTwilioClient();
  if (!client) {
    console.warn("⚠️ TWILIO no configurado. WhatsApp no enviado.");
    return false;
  }

  const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
  const to = `whatsapp:${phoneNumber.replace(/[^0-9]/g, "")}`;

  try {
    await client.messages.create({ from, to, body: message });
    console.log("💬 WhatsApp enviado a:", phoneNumber);
    return true;
  } catch (err) {
    console.error("❌ Error al enviar WhatsApp:", err.message);
    return false;
  }
};

export const formatBookingItems = (booking) => [
  { label: "Código", value: booking._id?.toString().slice(-6).toUpperCase() || "—" },
  { label: "Hotel / Paquete", value: booking.hotel?.name || booking.trip?.name || booking.trip?.title || "—" },
  { label: "Destino", value: booking.hotel?.location?.city || booking.trip?.destination || "—" },
  { label: "Habitación", value: booking.room ? `#${booking.room.roomNumber} (${booking.room.type})` : "—" },
  { label: "Entrada", value: new Date(booking.checkIn).toLocaleDateString("es-ES") },
  { label: "Salida", value: new Date(booking.checkOut).toLocaleDateString("es-ES") },
  { label: "Precio", value: booking.totalPrice ? `$${booking.totalPrice.toLocaleString()}` : booking.room?.pricePerNight ? `$${booking.room.pricePerNight}/noche` : "—" },
];
