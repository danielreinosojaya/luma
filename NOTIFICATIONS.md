# 📧 Sistema de Notificaciones por Correo - Luma

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

### ✅ RECOMENDADO: Generar muestras HTML locales

Este es el método más rápido y no requiere conexión a servidores:

```bash
npx tsx scripts/generate-email-samples.ts
```

**Qué hace:**
- Genera 7 archivos HTML (uno por cada tipo de notificación)
- Los guarda en `email-samples/`
- Se abre en navegador para verlos directamente
- Sin dependencias de SMTP ni conexión a internet
- Instantáneo

**Salida esperada:**
```
✅ Confirmación de Cita
   📄 Archivo: email-samples/appointment_confirmed.html
   
✅ Recordatorio de Cita
   📄 Archivo: email-samples/appointment_reminder.html
   
[... 5 correos más ...]

✨ Todos los archivos HTML están listos para revisar visualmente.
```

**Ver los correos:**
```bash
# Abre el navegador con un correo
open email-samples/appointment_confirmed.html

# O abre la carpeta completa en VS Code
code email-samples/
```

---

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
console.log('Message ID:', data.messageId);
```

---

### ❌ NO RECOMENDADO: Script Ethereal (requiere conexión SMTP)

```bash
npx tsx scripts/send-test-emails.ts
```

**Nota:** Este script intenta conectarse a servidores SMTP externos (Ethereal Email). Si tienes problemas de conexión, usa el método 1 (generar HTML locales).

---

## 💡 Información Técnica

### Cómo Funciona

#### Método 1: Archivos HTML locales (RECOMENDADO)
- Genera archivos HTML puros con estilos incrustados
- Se puede abrir en navegador sin conexión
- Perfecto para revisar diseño y contenido
- Sin dependencias externas

#### Método 2: API Endpoint
- Usa Ethereal Email (servicio gratuito de Nodemailer)
- Genera URLs de previsualización
- Requiere conexión a internet
- Útil si necesitas URLs shareable

#### Método 3: En Producción
- Cambiar a Brevo (ya está en `src/lib/email/brevo.ts`)
- Usar credenciales reales de API
- Enviar correos a direcciones verdaderas
- Registrar dominio y configurar SPF/DKIM

## 📝 Diseño de Correos

### Características
- ✅ Responsive design (se ve bien en móvil)
- ✅ Colores corporativos de Luma (dorado #C4956F)
- ✅ Información contextual realista
- ✅ Botones de acción
- ✅ Footer con contacto
- ✅ HTML válido con estilos incrustados

### Datos de Ejemplo
- **Servicios**: Blow & Glow, Luma Queen, Iconic Nails, etc.
- **Personal**: Valentina, Catalina, María
- **Precios**: Según tarifa actual
- **Ubicación**: Quito, Ecuador
- **Horarios**: Lunes-Viernes 9 AM - 6 PM, Sábados 9 AM - 5 PM

## 📊 Estructura de Carpetas

```
luma/
├── scripts/
│   ├── generate-email-samples.ts    ← ✅ Script recomendado
│   ├── send-test-emails.ts          ← Script SMTP (requiere conexión)
│   └── send-test-email-interactive.ts
├── email-samples/                    ← 📄 Archivos HTML generados
│   ├── appointment_confirmed.html
│   ├── appointment_reminder.html
│   ├── appointment_cancelled.html
│   ├── appointment_rescheduled.html
│   ├── staff_update.html
│   ├── promotion.html
│   └── password_reset.html
└── src/app/api/v1/notifications/
    └── test-email/
        └── route.ts                  ← Endpoint API
```

## 🔧 Personalización

### Cambiar Destinatario

En `scripts/generate-email-samples.ts` o en el endpoint API.

### Cambiar Branding

Busca por "Luma" en los scripts para cambiar:
- Nombre del negocio
- Colores corporativos
- URLs de enlaces
- Contacto

### Agregar Más Notificaciones

1. En `type NotificationType = ...` agrega el nuevo tipo
2. En `templates: Record<>` agrega el HTML del nuevo correo
3. Ejecuta el script

## 🛠️ Troubleshooting

### Error: "Cannot find module"
```bash
npm install
```

### Los archivos HTML no se generan
- Verifica permisos de escritura: `ls -la email-samples/`
- Intenta crear el directorio manualmente: `mkdir email-samples`

### Endpoint API no responde
```bash
# Verifica que el servidor esté corriendo
npm run dev

# Prueba el endpoint
curl http://localhost:3000/api/v1/notifications/test-email
```

## 📚 Próximos Pasos

1. ✅ Revisar visualmente los correos
2. 📧 Integrar con base de datos (guardar historial)
3. 🔄 Configurar cron jobs para envíos automáticos
4. 📊 Agregar analytics (abiertos, clicks, etc.)
5. 🌐 Implementar en producción con credenciales reales

---

**Nota**: Este sistema es para testing y desarrollo. En producción, usa los endpoints reales después de configurar un servicio de email como Brevo con credenciales válidas.
