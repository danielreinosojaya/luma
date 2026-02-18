# 🚀 Checklist Producción - Luma

## 1. 🔒 Seguridad & Configuración

### Variables de Entorno
- [ ] Cambiar `NEXTAUTH_URL` de `localhost:3000` a dominio real (ej: `https://luma.com`)
- [ ] Usar **variables de entorno seguras** en el hosting (Vercel, Railway, etc.)
- [ ] Nunca commitear `.env.local` a git (ya está en `.gitignore`)
- [ ] Verificar temas sensibles no están en código fuente
- [ ] Configurar **CORS** si tienes frontend separado

### Auth & Sesiones
- [ ] Generar nuevo `NEXTAUTH_SECRET` más fuerte con: `openssl rand -base64 32`
- [ ] Configurar `NEXTAUTH_TRUST_HOST=true` en producción
- [ ] Habilitar HTTPS obligatorio para cookies
- [ ] Configurar política de sesiones (duración, refresh)
- [ ] Implementar 2FA/MFA si es requerido

### SQL Injection & Rate Limiting
- [ ] Verificar todas las queries usan **Prisma** (no raw SQL vulnerable)
- [ ] Revisar que rate-limit está activo en rutas API críticas
- [ ] Configurar límites más estrictos en producción vs desarrollo

---

## 2. 🗄️ Base de Datos

### Neon PostgreSQL
- [ ] **Backup automático** habilitado
- [ ] Configurar **plan pagado** (desarrollo podría usar free)
- [ ] Revisar logs de conexión y performance
- [ ] Crear índices en campos frecuentemente consultados:
  ```sql
  CREATE INDEX idx_appointments_userId ON "appointment"("userId");
  CREATE INDEX idx_appointments_staffId ON "appointment"("staffId");
  CREATE INDEX idx_payments_appointmentId ON "payment"("appointmentId");
  ```
- [ ] Hacer **schema dump** para respaldos

### Migraciones
- [ ] Revisar todas las migraciones en `prisma/migrations/`
- [ ] Testear migración en staging antes de producción
- [ ] Tener **plan de rollback** si algo falla

---

## 3. 📧 Email & Notificaciones

### Brevo SMTP
- [ ] Verificar dominio en Brevo (SPF, DKIM, DMARC)
- [ ] Cambiar `BREVO_FROM_EMAIL` a email de dominio real
- [ ] Configurar templates HTML en Brevo para:
  - Confirmación de cita
  - Recordatorio 24h antes
  - Cancelación
  - Receipts de pago
- [ ] Testear envíos en environment de staging
- [ ] Configurar **bounce handling** para emails inválidos

### Logs & Monitoring
- [ ] Implementar logging de emails enviados (Prisma audit log)
- [ ] Alertas si tasa de bounces aumenta

---

## 4. 💳 Pagos

### Stripe/PayPal (según implementación)
- [ ] Integrar SDK de pagos recomendado
- [ ] **Modo TEST → PRODUCTION** (cambiar keys)
- [ ] Webhook de IPN/confirmación de pago
- [ ] Validar que `payments` tabla se populate correctamente
- [ ] Implementar retry para pagos fallidos
- [ ] PCI DSS compliance (no guardar CVV)

### Rutas Críticas
- [ ] `/api/v1/payments` - usar **idempotency** (ya existe)
- [ ] Validar monto antes de procesar
- [ ] Log auditoría de todas las transacciones

---

## 5. 🔍 Testing & Monitoreo

### Testing
- [ ] Unit tests para funciones críticas (auth, pagos)
- [ ] Integration tests para flujos principales
- [ ] Load testing (herramientas: k6, Apache JMeter)
- [ ] Prueba manual de todo el flujo:
  - Registro → Login → Booking → Pago → Email

### Monitoreo en Producción
- [ ] Configurar **error tracking** (Sentry, LogRocket)
- [ ] Alertas para errores críticos
- [ ] Monitoreo de uptime
- [ ] Logs centralizados (Vercel tiene built-in)
- [ ] Métricas de performance (Core Web Vitals)

---

## 6. 📱 Deployment

### Opción A: Vercel (Recomendado para Next.js)
- [ ] Conectar repo de GitHub
- [ ] Configurar variables de entorno en dashboard
- [ ] Habilitar **Preview Deployments** para PRs
- [ ] Configurar dominio personalizado
- [ ] Habilitar **Automatic SSL** (Vercel lo hace by default)
- [ ] Configurar rama de producción (main)

### Opción B: Railway / Render / Fly.io
- [ ] Crear `Dockerfile` si es necesario:
  ```dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY . .
  RUN npm ci
  RUN npm run build
  EXPOSE 3000
  CMD ["npm", "start"]
  ```
- [ ] Configurar env vars
- [ ] Build & deploy automático desde git

### General
- [ ] Configurar **CI/CD pipeline** (GitHub Actions)
  ```yaml
  - npm install
  - npm run lint
  - npm run build
  - Deploy a producción
  ```
- [ ] Health check endpoint: `GET /api/health`

---

## 7. 🎯 Performance

### Next.js Optimization
- [ ] Habilitar **Incremental Static Regeneration (ISR)** para pages estáticas
- [ ] Implementar **Image Optimization** si hay fotos
- [ ] Code splitting automático (Next.js lo hace)
- [ ] Revisar bundle size: `npm run build` → output

### Caching
- [ ] Configurar **Redis** (Upstash) para:
  - Sesiones de usuario
  - Cache de disponibilidad de slots
  - Rate limit counters (ya implementado)
- [ ] TTL apropiado para caché

### Database Performance
- [ ] Usar `select` en Prisma para traer solo campos necesarios
- [ ] Implementar **pagination** en listas
- [x] **Connection pooling** implementado (Pool nativo en `PrismaPg` adapter)

---

## 8. 📋 Compliance & Legal

- [ ] **Política de Privacidad** actualizada
- [ ] **Términos de Servicio**
- [ ] **GDPR**: Implementar derecho a olvidar, exportar datos
- [ ] **Cookies policy** si usas tracking
- [ ] **Accesibilidad**: WCAG 2.1 AA mínimo
- [ ] Revisar que no hay datos sensibles en logs públicos

---

## 9. 🔄 Post-Deployment

### Primeras 24-48 horas
- [ ] Monitorear errores en Sentry
- [ ] Revisar logs de acceso
- [ ] Testear casos edge
- [ ] Tener **rollback plan** listo

### Mantención Continua
- [ ] Updates de seguridad (npm audit)
- [ ] Revisar performance mensual
- [ ] Backup automático de BD
- [ ] Revisar logs de audit regularmente

---

## 📊 Resumen Por Prioridad

### 🔴 CRÍTICO (Hacer ANTES de publicar)
1. Generar `NEXTAUTH_SECRET` fuerte
2. Cambiar `NEXTAUTH_URL` a dominio real
3. Configurar variables secretas en hosting
4. Testing completo de flujo de pago
5. HTTPS habilitado
6. Verificar dominio en Brevo

### 🟠 IMPORTANTE (Hacer en primeras 2 semanas)
1. Sentry/error tracking
2. CI/CD pipeline
3. Índices en BD
4. Monitoring básico
5. Backup automático

### 🟡 DESEABLE (Roadmap futuro)
1. 2FA/MFA
2. Load testing
3. Cache optimization
4. Analytics avanzado
5. Dashboard admin mejorado

---

## 🚀 Comandos Útiles

```bash
# Build para producción
npm run build
npm start

# Revisar seguridad
npm audit

# Prisma
npx prisma migrate deploy  # En CI/CD
npx prisma studio         # Ver BD visualmente

# Lint antes de desplegar
npm run lint
```

---

**Última actualización:** Feb 11, 2026
