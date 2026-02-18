/**
 * Script para probar el envío de correos de notificación
 * Simula diferentes tipos de notificaciones del negocio Luma
 *
 * Uso: npx tsx scripts/send-test-emails.ts
 */

import nodemailer from "nodemailer";

// Tipos de notificación disponibles
type NotificationType =
  | "appointment_confirmed"
  | "appointment_reminder"
  | "appointment_cancelled"
  | "appointment_rescheduled"
  | "staff_update"
  | "promotion"
  | "password_reset";

interface EmailTemplate {
  subject: string;
  html: string;
}

// Configuración de transporte para Ethereal (servicio gratuito de testing)
// En producción, se usaría Brevo u otro servicio con credenciales reales
async function getTransporter() {
  const testAccount = await nodemailer.createTestAccount();

  return {
    transporter: nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    testAccount,
  };
}

// Templates de correos por tipo de notificación
function getEmailTemplate(type: NotificationType): EmailTemplate {
  const baseStyle = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #2C2623; }
      .container { max-width: 600px; margin: 0 auto; border: 1px solid #E8DDD7; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #C4956F 0%, #A67C52 100%); padding: 40px 20px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 28px; }
      .header p { margin: 10px 0 0 0; opacity: 0.9; }
      .content { padding: 30px 20px; }
      .info-block { background: #FAF8F6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C4956F; }
      .button { display: inline-block; background: #C4956F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: 600; }
      .footer { background: #F5F1EB; padding: 20px; text-align: center; color: #8B7862; font-size: 12px; }
      .detail { margin: 10px 0; }
      .detail strong { color: #2C2623; }
    </style>
  `;

  const templates: Record<NotificationType, EmailTemplate> = {
    appointment_confirmed: {
      subject: "✅ Tu cita ha sido confirmada - Luma",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>¡Cita Confirmada!</h1>
            <p>Tu reserva en Luma está lista</p>
          </div>
          <div class="content">
            <p>Hola <strong>María</strong>,</p>
            <p>Tu cita ha sido confirmada exitosamente. Aquí están los detalles:</p>
            <div class="info-block">
              <div class="detail"><strong>📅 Fecha:</strong> 15 de febrero, 2026</div>
              <div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div>
              <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow (Cepillado + Cejas)</div>
              <div class="detail"><strong>👩 Esteticiente:</strong> Valentina</div>
              <div class="detail"><strong>💰 Costo:</strong> $15.99</div>
              <div class="detail"><strong>📍 Ubicación:</strong> Quito, Pichincha</div>
            </div>
            <p>Por favor, llega 5 minutos antes de tu cita. Si necesitas cancelar o cambiar tu horario, notificanos con al menos 24 horas de anticipación.</p>
            <a href="https://luma-git-admin.vercel.app" class="button">Ver Tu Reserva</a>
            <p style="color: #8B7862; margin-top: 30px;">¡Nos vemos pronto en Luma!</p>
          </div>
          <div class="footer">
            Luma | Quito, Ecuador<br>
            <a href="mailto:danielreinosojaya@gmail.com" style="color: #C4956F;">Contáctanos</a>
          </div>
        </div>
      `,
    },

    appointment_reminder: {
      subject: "⏰ Recordatorio: Tu cita es mañana - Luma",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>⏰ ¡Recordatorio de Cita!</h1>
            <p>Tu cita es mañana</p>
          </div>
          <div class="content">
            <p>Hola <strong>María</strong>,</p>
            <p>Solo te recordamos que tienes una cita programada para mañana:</p>
            <div class="info-block">
              <div class="detail"><strong>📅 Mañana 15 de febrero</strong></div>
              <div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div>
              <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div>
              <div class="detail"><strong>👩 Con:</strong> Valentina</div>
            </div>
            <p>✅ Por favor, confirma tu asistencia</p>
            <a href="https://luma-git-admin.vercel.app" class="button">Confirmar Cita</a>
          </div>
          <div class="footer">
            Luma | Quito, Ecuador
          </div>
        </div>
      `,
    },

    appointment_cancelled: {
      subject: "❌ Tu cita ha sido cancelada - Luma",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Cita Cancelada</h1>
            <p>Tu reserva ha sido cancelada</p>
          </div>
          <div class="content">
            <p>Hola <strong>María</strong>,</p>
            <p>Tu cita ha sido cancelada:</p>
            <div class="info-block">
              <div class="detail"><strong>📅 Fecha:</strong> 15 de febrero, 2026</div>
              <div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div>
              <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div>
              <div class="detail"><strong>❌ Estado:</strong> Cancelada</div>
            </div>
            <p>Si fue por error, puedes crear una nueva cita desde nuestra plataforma.</p>
            <a href="https://luma-git-admin.vercel.app" class="button">Crear Nueva Cita</a>
          </div>
          <div class="footer">
            Luma | Quito, Ecuador
          </div>
        </div>
      `,
    },

    appointment_rescheduled: {
      subject: "📅 Tu cita ha sido reprogramada - Luma",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>📅 Cita Reprogramada</h1>
            <p>Tu nueva fecha está lista</p>
          </div>
          <div class="content">
            <p>Hola <strong>María</strong>,</p>
            <p>Tu cita ha sido reprogramada a una nueva fecha:</p>
            <div class="info-block">
              <div class="detail"><strong>📅 Fecha Original:</strong> 15 febrero → <strong>18 febrero, 2026</strong></div>
              <div class="detail"><strong>🕐 Hora:</strong> 2:00 PM (era 10:30 AM)</div>
              <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div>
              <div class="detail"><strong>👩 Esteticiente:</strong> Valentina</div>
            </div>
            <p>Por favor, confirma que este nuevo horario te conviene.</p>
            <a href="https://luma-git-admin.vercel.app" class="button">Confirmar Nueva Fecha</a>
          </div>
          <div class="footer">
            Luma | Quito, Ecuador
          </div>
        </div>
      `,
    },

    staff_update: {
      subject: "👩 Actualización: Cambios en nuestro equipo - Luma",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Cambios en Nuestro Equipo</h1>
            <p>Nos alegra compartirte noticias nuevas</p>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>¡Noticias emocionantes! Nuestro equipo en Luma ha crecido:</p>
            <div class="info-block">
              <div class="detail"><strong>✨ Nuevo Servicio Disponible:</strong> Extensiones de Pestañas Premium</div>
              <div class="detail"><strong>👩 Nuevo Personal:</strong> Catalina, especialista en uñas con 5 años de experiencia</div>
              <div class="detail"><strong>⏰ Nuevos Horarios:</strong> Ahora abierto sábados de 9 AM a 5 PM</div>
            </div>
            <p>¡Reserva con Catalina ahora mismo y disfruta de un 10% de descuento en tu primera cita!</p>
            <a href="https://luma-git-admin.vercel.app" class="button">Ver Disponibilidad</a>
          </div>
          <div class="footer">
            Luma | Quito, Ecuador
          </div>
        </div>
      `,
    },

    promotion: {
      subject: "🎉 Oferta Especial: 20% Descuento en Combos - Luma",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Oferta Especial Para Ti!</h1>
            <p>Descuentos exclusivos esta semana</p>
          </div>
          <div class="content">
            <p>Hola <strong>María</strong>,</p>
            <p>Tenemos una promoción especial solo para ti esta semana:</p>
            <div class="info-block">
              <div class="detail"><strong>💰 Descuento:</strong> 20% en todos nuestros paquetes combo</div>
              <div class="detail"><strong>📦 Paquetes Incluidos:</strong></div>
              <div style="margin-left: 20px; margin-top: 10px;">
                • Luma Queen: $28 → $22.40<br>
                • Iconic Nails: $18.99 → $15.19<br>
                • Glam Reset: $18 → $14.40
              </div>
              <div class="detail"><strong>⏰ Válido hasta:</strong> 21 de febrero, 2026</div>
            </div>
            <p>¡No te pierdas esta oportunidad! Reserva ahora mismo.</p>
            <a href="https://luma-git-admin.vercel.app" class="button">Ver Ofertas</a>
          </div>
          <div class="footer">
            Luma | Quito, Ecuador
          </div>
        </div>
      `,
    },

    password_reset: {
      subject: "🔐 Restablece tu contraseña - Luma",
      html: `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Restablece Tu Contraseña</h1>
            <p>Solicitaste un cambio de contraseña</p>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
            <div class="info-block">
              <p style="text-align: center; margin: 20px 0;">
                <a href="https://luma-git-admin.vercel.app/reset-password?token=abc123xyz" class="button">Restablecer Contraseña</a>
              </p>
              <p style="font-size: 12px; color: #8B7862;">Este enlace expira en 1 hora</p>
            </div>
            <p>Si no solicitaste esto, por favor contacta con nosotros de inmediato.</p>
          </div>
          <div class="footer">
            Luma | Quito, Ecuador<br>
            <a href="mailto:danielreinosojaya@gmail.com" style="color: #C4956F;">Soporte</a>
          </div>
        </div>
      `,
    },
  };

  return templates[type];
}

// Función principal para enviar coreos de prueba
async function sendTestEmails() {
  console.log("🚀 Iniciando envío de correos de prueba para Luma...\n");

  try {
    const { transporter, testAccount } = await getTransporter();

    const notificationTypes: NotificationType[] = [
      "appointment_confirmed",
      "appointment_reminder",
      "appointment_cancelled",
      "appointment_rescheduled",
      "staff_update",
      "promotion",
      "password_reset",
    ];

    const recipientEmail = "danielreinosojaya@gmail.com";

    console.log(`📧 Enviando ${notificationTypes.length} correos de prueba a: ${recipientEmail}\n`);
    console.log("=" + "=".repeat(79));

    for (const notificationType of notificationTypes) {
      const template = getEmailTemplate(notificationType);

      try {
        const info = await transporter.sendMail({
          from: `"Luma" <noreply@luma-beauty.ec>`,
          to: recipientEmail,
          subject: template.subject,
          html: template.html,
        });

        console.log(`✅ ${notificationType.toUpperCase()}`);
        console.log(`   📧 ID de Correo: ${info.messageId}`);
        console.log(`   🔗 URL de Previsualización: ${nodemailer.getTestMessageUrl(info)}`);
        console.log();
      } catch (error) {
        console.error(`❌ ${notificationType.toUpperCase()}`);
        console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
        console.log();
      }
    }

    console.log("=" + "=".repeat(79));
    console.log("\n✨ Envío de correos de prueba completado!\n");
    console.log("📌 Información importante:");
    console.log(`   • Los correos fueron enviados usando Ethereal Email (servicio de testing)`);
    console.log(`   • Haz clic en los URLs anteriores para ver la previsualización en el navegador`);
    console.log(`   • En producción, se usarían credenciales reales de Brevo o similar\n`);
  } catch (error) {
    console.error("❌ Error al enviar los correos:", error);
    process.exit(1);
  }
}

// Ejecutar el script
sendTestEmails();
