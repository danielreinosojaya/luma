# 🚀 SETUP INICIAL PARA LUMA

## ⚙️ Prerrequisitos

- Node.js 18+ / npm
- Cuenta en Neon (PostgreSQL)
- Cuenta en Brevo (Email SMTP)
- Cuenta en Upstash (Redis serverless)

---

## 📋 PASO A PASO

### 1️⃣ Configurar Base de Datos (Neon PostgreSQL)

```bash
# 1. Ir a https://console.neon.tech/
# 2. Crear nuevo proyecto
# 3. Copiar connection string (postgresql://...)
# 4. Pegar en .env.local:

DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

**Verificar conexión:**
```bash
npx prisma db execute --stdin < /dev/null
```

---

### 2️⃣ Configurar Email (Brevo SMTP)

```bash
# 1. Ir a https://www.brevo.com/
# 2. Settings → SMTP & API → SMTP credentials
# 3. Copiar datos en .env.local:

BREVO_SMTP_HOST="smtp-relay.brevo.com"
BREVO_SMTP_PORT="587"
BREVO_SMTP_USER="your-brevo-email@example.com"
BREVO_SMTP_PASS="your-api-key"
BREVO_FROM_EMAIL="noreply@lumabeauty.com"
BREVO_FROM_NAME="Luma"
```

**Prueba:**
```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

### 3️⃣ Configurar Rate Limiting (Upstash)

```bash
# 1. Ir a https://console.upstash.com/
# 2. Create database (Serverless, Region cercana)
# 3. Copiar en .env.local:

UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxtoken"
```

---

### 4️⃣ Configurar Auth (NextAuth)

```bash
# Generar secret seguro (ejecutar en terminal):
openssl rand -base64 32

# Resultado: copiar en .env.local
NEXTAUTH_SECRET="tu-secret-generado"
NEXTAUTH_URL="http://localhost:3000"
```

---

### 5️⃣ Inicializar Base de Datos

```bash
# Instalar deps
npm install

# Generar Prisma client
npx prisma generate

# Crear migraciones iniciales
npx prisma migrate dev --name init

# Cuando se pida "Enter a name", escribir "init"
```

✅ **Esto crea todas las tablas en Neon**

---

### 6️⃣ Verificar Setup

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Ver BD en GUI
npx prisma studio

# Terminal 3: Probar endpoint
curl http://localhost:3000/api/v1/services

# Resultado esperado:
# {"success":true,"data":[]}
```

---

## 🧪 Probar Endpoints

### Crear Servicio (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manicura Clásica",
    "category": "NAILS",
    "durationMin": 30,
    "price": 12.00,
    "description": "Manicura básica con esmalt"
  }'
```

### Listar Servicios

```bash
curl http://localhost:3000/api/v1/services
```

### Agendar Cita

```bash
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Juan Pérez",
    "clientEmail": "juan@example.com",
    "clientPhone": "+593987654321",
    "staffId": "STAFF_ID_HERE",
    "serviceIds": ["SERVICE_ID_HERE"],
    "startAt": "2026-02-24T10:00:00Z",
    "idempotencyKey": "unique-key-123"
  }'
```

---

## 🔧 Variables .env Completas

```env
# DATABASE
DATABASE_URL="postgresql://..."

# EMAIL
BREVO_SMTP_HOST="smtp-relay.brevo.com"
BREVO_SMTP_PORT="587"
BREVO_SMTP_USER="..."
BREVO_SMTP_PASS="..."
BREVO_FROM_EMAIL="noreply@lumabeauty.com"
BREVO_FROM_NAME="Luma"

# REDIS
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# AUTH
NEXTAUTH_SECRET="..." (generar con: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"

# APP
NEXT_PUBLIC_APP_NAME="Luma"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ❌ Troubleshooting

### Error: "Cannot connect to database"
```bash
# 1. Verificar DATABASE_URL en .env.local
# 2. Verificar credentials Neon
# 3. Verificar IP whitelist en Neon (Settings → IP Whitelist → Allow all)
```

### Error: "SMTP connection failed"
```bash
# 1. Verificar credenciales Brevo
# 2. Usar puerto 587 (TLS)
# 3. Probar: telnet smtp-relay.brevo.com 587
```

### Error: "Redis connection refused"
```bash
# 1. Verificar Upstash URL y token
# 2. Verificar red (si está en VPN, desactivar)
# 3. Usar curl para probar: curl $UPSTASH_REDIS_REST_URL/ping
```

---

## 📊 Próximos Pasos

1. ✅ Backend + API endpoints
2. ⏳ Landing page (HTML template con tu paleta de colores)
3. ⏳ Admin panel (CRUD completo + Dashboard)
4. ⏳ Integraciones avanzadas (SMS, WhatsApp, Analytics)

---

## 💬 Dudas Frecuentes

**¿Necesito configurar CDN?**
No. Vercel + Upstash + Brevo ya cubre todo lo necesario.

**¿Qué pasa con los pagos?**
MVP: Solo registro manual (CASH, CARD, TRANSFER). Admin verifica y confirma.

**¿Cómo hacer login de admin?**
Próxima fase: Implementar JWT + NextAuth con roles.

---

**Status:** ✅ Backend Online | ⏳ UI Development