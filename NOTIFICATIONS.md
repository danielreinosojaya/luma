# 📧 Sistema de Notificaciones por Correo - Luma Beauty Studio

Este sistema simula el envío de correos de notificación para el negocio sin necesidad de configurar dominio ni DNS.

## 🎯 Tipos de Notificaciones Disponibles

1. **appointment_confirmed** - Confirmación de cita
2. **appointment_reminder** - Recordatorio de cita (1 día antes)
3. **appointment_cancelled** - Notificación de cancelación
4. **appointment_rescheduled** - Cita reprogramada
5. **staff_update** - Actualizaciones del equipo
6. **promotion** - Promociones y ofertas
7. **password_reset** - Restablecimiento de contraseña

## 🚀 Cómo Usar

### Opción 1: Script de Node.js (Recomendado para Testing Local)

Ejecuta el script que envía todos los tipos de correos:

```bash
npx tsx scripts/send-test-emails.ts
```

**Qué hace:**
- Envía 7 correos de prueba (uno por cada tipo de notificación)
- Usa Ethereal Email (servicio gratuito de testing)
- Genera URLs para ver la previsualización en el navegador
- No requiere configuración de dominio ni DNS

**Salida esperada:**
```
✅ APPOINTMENT_CONFIRMED
   📧 ID de Correo: <xyz@ethereal.email>
   🔗 URL de Previsualización: https://ethereal.email/messages/...

✅ APPOINTMENT_REMINDER
   📧 ID de Correo: <abc@ethereal.email>
   🔗 URL de Previsualización: https://ethereal.email/messages/...

[... más correos ...]
```

### Opción 2: Endpoint API (Para Testing con Frontend)

**URL:** `POST /api/v1/notifications/test-email`

**Payload:**
```json
{
  "notificationType": "appointment_confirmed",
  "recipientEmail": "danielreinosojaya@gmail.com"
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/notifications/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "notificationType": "appointment_confirmed",
    "recipientEmail": "danielreinosojaya@gmail.com"
  }'
```

**Ejemplo con JavaScript/Fetch:**
```javascript
const response = await fetch('/api/v1/notifications/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    notificationType: 'appointment_confirmed',
    recipientEmail: 'danielreinosojaya@gmail.com'
  })
});

const data = await response.json();
console.log('Preview URL:', data.previewUrl); // Abre en navegador
```

### Opción 3: Cliente CLI con Selección Interactiva

```bash
npx tsx scripts/send-test-email-interactive.ts
```

Luego selecciona el tipo de notificación e ingresa el correo destinatario.

## 💡 Información Técnica

### Cómo Funciona

1. **Ethereal Email**: Servicio gratuito de Nodemailer para testing
   - No envía correos reales, solo genera URLs de previsualización
   - Perfecto para desarrollo sin configurar DNS/SMTP real

2. **Templates HTML**: Cada notificación tiene su propio template con:
   - Estilos personalizados del negocio (colores Luma)
   - Información contextual realista
   - Botones de acción
   - Footer con contacto

3. **En Producción**:
   - Cambiar a Brevo (ya está en `src/lib/email/brevo.ts`)
   - Usar credenciales reales de API
   - Enviar correos a direcciones verdaderas
   - Registrar dominio y configurar SPF/DKIM

## 📝 Ejemplo de Uso Completo

### Local Development
```bash
# 1. Instala dependencias (si no las tienes)
npm install

# 2. Ejecuta el script de testing
npx tsx scripts/send-test-emails.ts

# 3. Abre los URLs en el navegador para ver las previsualizaciones
# Verás algo como:
# https://ethereal.email/messages/CmH...

# 4. Si quieres probar desde la API, inicia el servidor
npm run dev

# 5. En otra terminal, llama al endpoint
curl -X POST http://localhost:3000/api/v1/notifications/test-email ...
```

## 🔧 Configuración Personalizada

### Cambiar Destinatario

En `scripts/send-test-emails.ts`, línea ~167:
```typescript
const recipientEmail = "danielreinosojaya@gmail.com"; // ← Cambia aquí
```

### Agregar Más Notificaciones

1. Agrega el tipo en `type NotificationType = ...`
2. Crea el template en `getEmailTemplate()`
3. Ejecuta el script para probarlo

## 📧 Datos de Ejemplo

Los correos incluyen datos realistas del negocio:
- **Servicios**: Blow & Glow, Luma Queen, Iconic Nails, etc.
- **Personal**: Valentina, Catalina, María
- **Precios**: Según tarifa actual
- **Ubicación**: Quito, Ecuador
- **Horarios**: Lunes-Viernes 9 AM - 6 PM, Sábados 9 AM - 5 PM

## 🛠️ Troubleshooting

### Error: "Cannot find module 'nodemailer'"
```bash
npm install nodemailer
```

### Ethereal no funciona
- Verifica conexión a internet
- Los URLs expiran en 48 horas
- Crea una nueva cuenta Ethereal si es necesario

### Endpoint API no responde
```bash
# Verifica que el servidor esté corriendo
npm run dev

# Verifica que la ruta esté correcta
# POST /api/v1/notifications/test-email
```

## 📚 Referencias

- [Nodemailer Ethereal](https://ethereal.email/)
- [Brevo API](https://brevo.com/) (para producción)
- [Email Best Practices](https://sendgrid.com/en-us/blog/email-best-practices)

---

**Nota**: Este sistema es para testing y desarrollo. En producción, usa los endpoints reales después de configurar un servicio de email como Brevo con credenciales válidas.
