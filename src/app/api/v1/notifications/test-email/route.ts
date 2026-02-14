import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type NotificationType =
  | "appointment_confirmed"
  | "appointment_reminder"
  | "appointment_cancelled"
  | "appointment_rescheduled"
  | "staff_update"
  | "promotion"
  | "password_reset";

// Obtener transporte para testing (Ethereal)
async function getTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Templates de correos
function getEmailTemplate(type: NotificationType) {
  const baseStyle = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #2C2623; }
      .container { max-width: 600px; margin: 0 auto; border: 1px solid #E8DDD7; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #C4956F 0%, #A67C52 100%); padding: 40px 20px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 28px; }
      .content { padding: 30px 20px; }
      .info-block { background: #FAF8F6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C4956F; }
      .button { display: inline-block; background: #C4956F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: 600; }
      .footer { background: #F5F1EB; padding: 20px; text-align: center; color: #8B7862; font-size: 12px; }
      .detail { margin: 10px 0; }
      .detail strong { color: #2C2623; }
    </style>
  `;

  const templates: Record<NotificationType, { subject: string; html: string }> = {
    appointment_confirmed: {
      subject: "✅ Tu cita ha sido confirmada - Luma Beauty Studio",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>¡Cita Confirmada!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>María</strong>,</p>
            <p>Tu cita ha sido confirmada exitosamente:</p>
            <div class="info-block">
              <div class="detail"><strong>📅 Fecha:</strong> 15 febrero, 2026</div>
              <div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div>
              <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div>
              <div class="detail"><strong>👩 Esteticiente:</strong> Valentina</div>
              <div class="detail"><strong>💰 Costo:</strong> $15.99</div>
            </div>
            <a href="https://luma.vercel.app" class="button">Ver Tu Reserva</a>
          </div>
          <div class="footer">
            Luma Beauty Studio | Quito, Ecuador
          </div>
        </div>
      `,
    },
    appointment_reminder: {
      subject: "⏰ Recordatorio: Tu cita es mañana",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>⏰ ¡Recordatorio!</h1>
          </div>
          <div class="content">
            <p>Tu cita es mañana a las 10:30 AM con Valentina.</p>
            <a href="https://luma.vercel.app" class="button">Confirmar Asistencia</a>
          </div>
          <div class="footer">
            Luma Beauty Studio | Quito, Ecuador
          </div>
        </div>
      `,
    },
    appointment_cancelled: {
      subject: "❌ Tu cita ha sido cancelada",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Cita Cancelada</h1>
          </div>
          <div class="content">
            <p>Tu cita del 15 febrero ha sido cancelada. Puedes crear una nueva desde nuestra plataforma.</p>
            <a href="https://luma.vercel.app" class="button">Crear Nueva Cita</a>
          </div>
          <div class="footer">
            Luma Beauty Studio | Quito, Ecuador
          </div>
        </div>
      `,
    },
    appointment_rescheduled: {
      subject: "📅 Tu cita ha sido reprogramada",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>📅 Cita Reprogramada</h1>
          </div>
          <div class="content">
            <p>Tu cita ha sido movida al 18 febrero a las 2:00 PM.</p>
            <a href="https://luma.vercel.app" class="button">Confirmar Nueva Fecha</a>
          </div>
          <div class="footer">
            Luma Beauty Studio | Quito, Ecuador
          </div>
        </div>
      `,
    },
    staff_update: {
      subject: "👩 Actualización: Cambios en nuestro equipo",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Cambios en Nuestro Equipo</h1>
          </div>
          <div class="content">
            <p>¡Tenemos nuevo personal! Catalina se ha unido al equipo como especialista en uñas.</p>
            <p>Ahora operamos también los sábados de 9 AM a 5 PM.</p>
            <a href="https://luma.vercel.app" class="button">Ver Disponibilidad</a>
          </div>
          <div class="footer">
            Luma Beauty Studio | Quito, Ecuador
          </div>
        </div>
      `,
    },
    promotion: {
      subject: "🎉 Oferta: 20% Descuento en Combos",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Oferta Especial!</h1>
          </div>
          <div class="content">
            <p>20% de descuento en todos nuestros paquetes combo esta semana.</p>
            <div class="info-block">
              <div class="detail">Luma Queen: $28 → $22.40</div>
              <div class="detail">Iconic Nails: $18.99 → $15.19</div>
              <div class="detail">Válido hasta 21 febrero</div>
            </div>
            <a href="https://luma.vercel.app" class="button">Ver Ofertas</a>
          </div>
          <div class="footer">
            Luma Beauty Studio | Quito, Ecuador
          </div>
        </div>
      `,
    },
    password_reset: {
      subject: "🔐 Restablece tu contraseña",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Restablecer Contraseña</h1>
          </div>
          <div class="content">
            <p>Haz clic en el botón para restablecer tu contraseña. Este enlace expira en 1 hora.</p>
            <a href="https://luma.vercel.app/reset" class="button">Restablecer Contraseña</a>
          </div>
          <div class="footer">
            Luma Beauty Studio | Quito, Ecuador
          </div>
        </div>
      `,
    },
  };

  return templates[type];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationType, recipientEmail } = body as {
      notificationType: NotificationType;
      recipientEmail: string;
    };

    if (!notificationType || !recipientEmail) {
      return NextResponse.json(
        { error: "Missing notificationType or recipientEmail" },
        { status: 400 }
      );
    }

    const template = getEmailTemplate(notificationType);
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"Luma Beauty Studio" <noreply@luma-beauty.ec>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    });

    // Para testing, devolvemos la URL para ver el correo
    const previewUrl = nodemailer.getTestMessageUrl(info);

    return NextResponse.json({
      success: true,
      message: `Correo ${notificationType} enviado a ${recipientEmail}`,
      messageId: info.messageId,
      previewUrl, // URL para ver en el navegador
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error sending email" },
      { status: 500 }
    );
  }
}
