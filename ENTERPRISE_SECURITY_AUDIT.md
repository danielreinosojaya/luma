# ANÁLISIS ENTERPRISE - LUMA BACKEND & SCHEMA
**Fecha:** Febrero 12, 2026  
**Nivel de Riesgo Overall:** 🔴 **CRÍTICO** - No recomendado para producción  

---

## 1. RIESGOS CRÍTICOS DE SEGURIDAD 🔒

### 1.1 **SIN AUTENTICACIÓN NI AUTORIZACIÓN** ⚠️ CRÍTICO
```typescript
// ❌ PROBLEMA: Todos los endpoints están públicos
export async function POST(request: NextRequest) {
  const body = await request.json();
  // NO HAY VERIFICACIÓN DE USUARIO
  // Cualquiera puede: crear citas, procesar pagos, ver datos de clientes
}
```

**Impacto:**
- Alguien puede crear citas para cualquier cliente
- Procesar pagos sin autorización
- Acceder a datos privados de otros clientes
- Modificar datos de la clínica

**Solución Requerida:**
```typescript
// Middleware de autenticación obligatorio
async function withAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return new NextResponse('Unauthorized', { status: 401 });
  
  const session = await verifySession(token);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  
  request.userId = session.userId;
  request.userRole = session.role;
}
```

### 1.2 **SIN CONTROL DE ACCESO (RBAC)** ⚠️ CRÍTICO
```typescript
// ❌ PROBLEMA: Un cliente puede:
// - Ver citas de otros clientes (clientEmail en query sin validación)
// - Cancelar citas de otros
// - Ver datos financieros
// - Editar servicios (TODO comment no hace nada)

export async function GET(request: NextRequest) {
  const clientEmail = searchParams.get("clientEmail"); // ¡Cualquiera lo puede pasar!
}

export async function POST(request: NextRequest) {
  // TODO: Add auth check for ADMIN role ❌ NO SE HIZO
}
```

**Matriz de Permisos Faltante:**
| Acción | ADMIN | STAFF | CLIENT |
|--------|-------|-------|--------|
| Ver citas propias | ✓ | ✓ | ✓ |
| Ver citas de otros | ✓ | ✗ | ✗ |
| Crear cita | ADMIN*1 | ✗ | ✓ |
| Cancelar cita | ✓ | ✓ | ✓*2 |
| Ver pagos | ✓ | ✓ | ✗✗ |
| Procesar pagos | ✓ | ✗ | ✗ |
| Editar servicios | ✓ | ✗ | ✗ |

### 1.3 **SQL INJECTION MEDIANTE PRISMA** ⚠️ ALTO
```typescript
// ✓ BIEN: Prisma protege de direct SQL injection
const appointments = await db.appointment.findMany({
  where: { client: { email: clientEmail } } // Parametrizado
});

// ❌ PERO: No hay validación del INPUT
// Un atacante puede enviar strings vacíos, emails inválidos, etc.
// Falta validar y sanitizar TODOS los inputs
```

### 1.4 **INFORMACIÓN SENSIBLE EN LOGS Y ERRORES** ⚠️ ALTO

```typescript
// ❌ PROBLEMA: Errores exponen estructura interna
console.error("GET /api/v1/appointments error:", error); // Stack trace en logs
return apiError("Error fetching appointments", "INTERNAL_ERROR")

// El error de Prisma podría revelar:
// - Estructura de base de datos
// - Nombres de campos
// - Query patterns
```

**Estándar Enterprise:**
```typescript
// ✓ BIEN: Genéricos en producción
if (process.env.NODE_ENV === 'production') {
  console.error('Query failed', { requestId: uuid() }); // Sin stack trace
  return apiError('An error occurred', 'INTERNAL_ERROR'); // Genérico
}
```

### 1.5 **PASSWORD HASHING CON BCRYPT 12 ROUNDS** ⚠️ MEDIO
```typescript
// ✓ BIEN:
return bcrypt.hash(password, 12);

// PERO: En 2026 con GPU attacks, considerar alternativas
// - Argon2 es más resistente (recomendado NIST)
// - scrypt también es más fuerte
```

### 1.6 **JWT TOKENS SIN FIRMA O VALIDACIÓN** ⚠️ CRÍTICO
```typescript
// ⚠️ PROBLEMA: No hay implementación de JWT visible
// La autenticación usa "sessions" pero sin ver cómo se generan

// Preguntas sin respuesta:
// - ¿Son JWT o sesiones en BD?
// - ¿Cuál es el secret?
// - ¿Token expiration?
// - ¿Token rotation?
// - ¿Revocation mechanism?
```

### 1.7 **MISSING: HTTPS ENFORCEMENT** ⚠️ CRÍTICO
```typescript
// Falta implementar:
response.headers.set(
  "Strict-Transport-Security",
  "max-age=31536000; includeSubDomains; preload" // ✓ Ya está
);

// PERO: No hay redirección HTTP → HTTPS
// No hay validación de certificados en client
// No hay Certificate Pinning para apps móviles
```

### 1.8 **FALTA: CSRF PROTECTION** ⚠️ ALTO
```typescript
// ❌ NO HAY CSRF TOKENS
// Un atacante en otro sitio puede hacer:
// <img src="https://luma.com/api/v1/appointments" 
//      body='{"staffId":"x","clientEmail":"hack@hack.com"}'>

// Solución:
// 1. Validar Origin header
// 2. CSRF tokens en POST/PUT/DELETE
// 3. SameSite=Strict cookies
```

### 1.9 **FALTA: INPUT VALIDATION COMPREHENSIVA** ⚠️ ALTO
```typescript
// ✓ BIEN: Usa Zod
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ❌ FALTA: 
// - Max length en strings (DDoS por strings enormes)
// - Validar números negativos, infs, NaNs
// - Validar dates no estén en el pasado (appointments)
// - Validar phone format más estricto
// - Rate limit por usuario después de auth
// - Detectar patrones de abuso

// Max saltos de arrays
z.array(z.string()).max(100, "Too many items") // FALTA THIS

// Validaciones de lógica de negocio
if (appointmentTime < now) {
  throw new Error("Cannot book in the past");
} // ESTO NO ESTÁ EN VALIDADOR
```

### 1.10 **FALTA: ENCRYPTION AT REST** ⚠️ CRÍTICO
```txt
❌ PROBLEMA: Datos sensibles sin encryption
- Client phone numbers (PLAIN TEXT)
- Appointment notes
- Payment details (si se almacenan)
- Financial summaries

✓ MÍNIMO ENTERPRISE:
- PII (email, phone) encriptado con AES-256
- Separate key management (AWS KMS, Vault)
- Key rotation policy
- Field-level encryption en Prisma
```

---

## 2. RIESGOS DE ESCALABILIDAD 📈

### 2.1 **N+1 QUERIES - PROBLEMA GRAVE**
```typescript
// ❌ ANTI-PATRÓN:
const appointments = await db.appointment.findMany({
  include: {
    staff: { include: { user: true } },        // +1 query per appointment
    services: { include: { service: true } },  // +1 query per appointment
    payment: true,                              // +1 query per appointment
  }
});

// Resultado: 1 + 3*N queries
// Con 1000 appointments = 3001 queries en 1 request!
```

**Con índices actuales:**
- `Appointment` → `Staff` → `User` = Viajable
- Pero sin límite de resultados → TIMEOUT en producción

**Solución:**
```typescript
// 1. Pagination siempre
const appointments = await db.appointment.findMany({
  take: 50,
  skip: (page - 1) * 50,
  include: { /* ... */ }
});

// 2. Lazy loading para datos secundarios
const appointments = await db.appointment.findMany({
  take: 50,
  select: { id: true, startAt: true, clientId: true }, // Solo lo necesario
});

// 3. Índices de búsqueda
// FALTA: CREATE INDEX idx_appointment_client_status 
//        ON appointment(client_id, status, start_at DESC);
```

### 2.2 **SIN LÍMITES DE RESULTADOS (QUERY BOMBING)**
```typescript
// ❌ PROBLEMA:
export async function GET(request: NextRequest) {
  const appointments = await db.appointment.findMany({
    where: { client: { email: clientEmail } },
    // ❌ NO HAY: take/skip
    // Si cliente hizo 100,000 citas → carga TODAS
  });
}

// Atacante: GET /api/v1/appointments?clientEmail=victim@com
// Si victim tiene 50,000 citas → 50MB+ response → OOM
```

**Impacto de Escalabilidad:**
- Memory leak en servidor
- Connection pool exhaustion
- Database slow down
- Cascading timeouts

### 2.3 **SIN CACHING DE DATOS ESTÁTICOS**
```typescript
// ❌ PROBLEMA: Cada request consulta BD para:

// Services - cambian poco
export async function GET(request: NextRequest) {
  const services = await db.service.findMany();
  // Con 100 requests/sec = 100 queries/sec al DB
  // Debería estar en Redis con TTL 1 hora
}

// Availability slots - se recalculan siempre
const existingAppointments = await db.appointment.findMany({
  where: { staffId, startAt: { gte: dayStart, lte: dayEnd } }
});
// Si 1000 usuarios checando disponibilidad = 1000 queries

// Solución con Redis:
const cacheKey = `slots:${staffId}:${date}`;
let slots = await redis.get(cacheKey);
if (!slots) {
  slots = calculateSlots(staffId, date); // Queries
  await redis.setex(cacheKey, 3600, JSON.stringify(slots));
}
```

### 2.4 **SIN ÍNDICES ADECUADOS EN BD**
```sql
-- ✓ EXISTEN:
CREATE INDEX idx_appointment_client_id ON appointment(client_id);
CREATE INDEX idx_appointment_staff_id ON appointment(staff_id);
CREATE INDEX idx_appointment_status ON appointment(status);
CREATE INDEX idx_appointment_start_at ON appointment(start_at);

-- ❌ FALTAN (CRÍTICOS):
-- Búsqueda de slots: staff + date range
CREATE INDEX idx_appointment_staff_date 
  ON appointment(staff_id, start_at, status);

-- Búsqueda de ocupación de servicios
CREATE INDEX idx_appointment_service_date 
  ON appointment_service(service_id, created_at);

-- Búsqueda de pagos por período
CREATE INDEX idx_payment_date_status 
  ON payment(created_at DESC, status);

-- Búsqueda de clientes por email
CREATE UNIQUE INDEX idx_client_email ON client(email);
-- ^ Ya existe pero no es PRIMARY

-- Audit logs por usuario + tiempo
CREATE INDEX idx_audit_user_date 
  ON audit_log(user_id, created_at DESC);

-- Notificaciones sin enviar
CREATE INDEX idx_notification_pending 
  ON notification(status, created_at) 
  WHERE status = 'PENDING';
```

### 2.5 **CONEXIÓN A BD SIN POOL MANAGEMENT**
```typescript
// ⚠️ PROBLEMA: Usar PrismaPg sin configurar pool
const pool = new Pool({ connectionString: databaseUrl });
// FALTA: maxConnections, idleTimeout, connectionTimeout

// En producción con 1000 concurrent users:
// - Sin pool config → 1000 conexiones activas
// - PostgreSQL default max_connections = 100 → FALLA

// Solución:
const pool = new Pool({
  connectionString: databaseUrl,
  max: 20,           // Max concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2.6 **IDEMPOTENCY KEY ALMACENADO EN DB**
```typescript
// ❌ PROBLEMA: IdempotencyKey en base de datos
const cached = await db.idempotencyKey.findUnique({
  where: { key: idempotencyKey }
});

// Con 1000 requests/sec = 1000 queries/sec
// La tabla crece sin control (cleanup cada 24h)
// ❌ Race condition: qué pasa entre check y insert?

// Mejor: Redis (in-memory)
const cached = await redis.get(`idempotency:${key}`);
if (!cached) {
  // Hacer operación
  await redis.setex(`idempotency:${key}`, 3600, result);
}
```

### 2.7 **RATE LIMITING CON UPSTASH REDIS**
```typescript
// ✓ BIEN: Usa Upstash (managed Redis)
const ratelimit = new Ratelimit({
  redis, limiter: Ratelimit.slidingWindow(10, "1 m"),
})

// ⚠️ PERO: Network latency
// Cada request hace 1 call a Redis (latency +50-200ms)
// Con 1000 requests/sec = 1000 Redis calls

// Mejor: Local rate limiting + Redis sync
const localLimiter = new Map(); // In-memory
if (localLimiter.get(key)?.count > limit) {
  // Block immediately (no network)
} else {
  // Async sync to Redis for distributed consistency
  await redis.incr(key);
}
```

---

## 3. BOTTLENECKS DE PERFORMANCE 🐌

### 3.1 **DISPONIBILIDAD DE SLOTS**
```typescript
// ❌ COMPLEJIDAD O(n*m): 
// n = appointments, m = 15-min slots
const existingAppointments = await db.appointment.findMany(); // O(n)
for (let minutes = start; minutes + duration <= end; minutes += 15) { // O(m)
  for (const apt of existingAppointments) {
    // Check conflict - O(n*m)
  }
}

// Con 500 appointments en un día y 40 slots:
// 500 * 40 = 20,000 operaciones por request

// Mejor: Usar algoritmo de interval merging O(n log n)
const busy = existingAppointments
  .map(a => ({start: a.startAt, end: a.endAt}))
  .sort((a,b) => a.start - b.start);

const free = [];
let lastEnd = dayStart;
for (const {start, end} of busy) {
  if (start > lastEnd) free.push([lastEnd, start]);
  lastEnd = max(lastEnd, end);
}
free.push([lastEnd, dayEnd]);

// Luego generar slots = O(m)
```

### 3.2 **CREACIÓN DE CITAS: SIN TRANSACCIÓN**
```typescript
// ❌ MÚLTIPLES QUERIES SIN TRANSACCIÓN:
let client = await db.client.findUnique(...);
if (!client) {
  client = await db.client.create(...); // Q1
}
const staff = await db.staff.findUnique(...); // Q2
const services = await db.service.findMany(...); // Q3
const conflicts = await db.appointment.findMany(...); // Q4
const appointment = await db.appointment.create(...); // Q5
for (const serviceId of data.serviceIds) {
  await db.appointmentService.create(...); // Q6, Q7, Q8...
}

// ❌ PROBLEMAS:
// 1. Race condition: 2 requests simultáneos pueden:
//    - Ambos ven slot libre
//    - Ambos creen cita
//    - Doble-booking!

// 2. Falla parcial: si Q6 falla, cita creada pero sin servicio

// 3. Performance: 8+ round-trips a BD
```

**Solución:**
```typescript
const appointment = await db.$transaction(async (tx) => {
  // Todas estas queries se ejecutan atómicamente
  let client = await tx.client.findUnique(...);
  if (!client) client = await tx.client.create(...);
  
  // Verificar novamente en transacción
  const conflicts = await tx.appointment.findMany({
    where: {
      staffId: data.staffId,
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      status: { in: ['CONFIRMED', 'PENDING'] },
    }
  });
  
  if (conflicts.length > 0) {
    throw new Error('Slot taken');
  }
  
  const appointment = await tx.appointment.create({...});
  
  for (const serviceId of data.serviceIds) {
    await tx.appointmentService.create({...});
  }
  
  return appointment;
});
```

### 3.3 **EMAIL ENVIADO SINCRONAMENTE**
```typescript
// ❌ PROBLEMA:
export async function POST(request: NextRequest) {
  const appointment = await createAppointment(...); // 10ms
  
  await sendEmail(emailTemplates.CONFIRMATION, {...}); // 500ms-5s!
  // El cliente espera a que el email se envíe
  // Timeout del request
}

// Solución: Queue asincrónico
// 1. Crear appointment
// 2. Enqueue job: { type: 'send_email', appointmentId }
// 3. Retornar response inmediatamente
// 4. Background worker procesa queue

// Herramientas:
// - Bull (Redis-backed)
// - Inngest (serverless)
// - BullMQ (recomendado)
```

### 3.4 **SIN COMPRESIÓN DE RESPUESTAS**
```typescript
// ❌ Sin GZIP, respuestas grandes:
// - 200 appointments * 2KB = 400KB payload
// - Con GZIP = ~40KB

// Next.js automático hace GZIP pero:
// - Validar que `gzip: true` en config
// - Validar min size para comprimir (default 1KB+)
```

---

## 4. RIESGOS EN APIs 🔗

### 4.1 **NO VALIDAR CONFLICTS EN APPOINTMENT UPDATE**
```typescript
// ❌ RIESGO:
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = body; // Contiene startAt, endAt

  // ❌ FALTA: Re-validar que la nueva hora no tiene conflictos
  // Si cambio cita de 2pm a 3pm DESPUÉS de que alguien reservó 3pm
  // = Doble booking
}
```

### 4.2 **NO VALIDAR PAYMENT AMOUNT**
```typescript
// ❌ PROBLEMA:
const amount = appointment.services.reduce(
  (sum: number, s: any) => sum + s.priceAtBooking,
  0
); // Confiamos en BD sin validar

// Mejor: re-calcular desde services
const latestPrices = await db.service.findMany({
  where: { id: { in: serviceIds } }
});
const calculatedAmount = latestPrices.reduce(
  (sum, s) => sum + s.price, 0
);

// Validar que no hay cambios de precio maliciosos
if (Math.abs(amount - calculatedAmount) > 0.01) {
  throw new Error('Price mismatch');
}
```

### 4.3 **SIN VERSIONADO DE API**
```typescript
// ✓ BIEN: /api/v1/ existe
// ❌ PERO: Sin plan de deprecación

// No hay:
// - Changelog de cambios en v1
// - Plan para v2
// - Migration guide
// - Sunset date para v1

// Estándar: HTTP header Deprecation
response.headers.set(
  'Deprecation',
  'true'
);
response.headers.set(
  'Sunset',
  'Wed, 31 Dec 2026 23:59:59 GMT'
);
```

### 4.4 **RESPUESTAS NO CONSISTENTES**
```typescript
// ❌ INCONSISTENCIA:

// En un endpoint:
return NextResponse.json(apiSuccess(result));

// En otro:
return NextResponse.json(apiSuccess({ 
  slots: [],
  message: "Staff not available" 
}));

// En otro:
return NextResponse.json(data); // Sin wrapping

// Debe ser: SIEMPRE mismo formato
{
  success: boolean,
  data: T | null,
  error?: { code: string, message: string },
  meta?: { page, total, timestamp }
}
```

### 4.5 **SIN DOCUMENTACIÓN DE API**
```txt
❌ FALTA:
- OpenAPI/Swagger schema
- Postman collection
- Example requests/responses
- Error codes documentation
- Rate limits documentados
- Field length limits
- Enum values

Enterprise standard:
- Swagger/OpenAPI con responses
- SDK auto-generado
- API gateway con docs online
```

---

## 5. RIESGOS EN SCHEMA 📊

### 5.1 **CASH PAYMENTS SIN AUDITORÍA ADECUADA**
```sql
-- ❌ PROBLEMA:
-- Payment con method='CASH' y status='PENDING'
-- Quién confirmó que el cash fue recibido?

-- Solución: Agregar campos
ALTER TABLE payment ADD COLUMN (
  confirmedByStaffId VARCHAR(36),
  confirmedAt TIMESTAMP,
  FOREIGN KEY (confirmedByStaffId) REFERENCES staff(id)
);

-- Y auditar cambio de status
CREATE TRIGGER audit_payment_status
BEFORE UPDATE ON payment
FOR EACH ROW
INSERT INTO audit_log VALUES (...);
```

### 5.2 **COMISIÓN POR STAFF COMO TEXTO (JSON)**
```typescript
// ❌ PROBLEMA:
model Staff {
  commissionRate  Float   @default(0.15)  // ✓ Bien
}

// Pero en FinanceSummary:
model FinanceSummary {
  staffCommissions String? // JSON array de comisiones
}

// ❌ PROBLEMAS:
// 1. No queryable en SQL
// 2. Sin validación de schema
// 3. Si JSON está corrupto = error al parsear
// 4. Sin índices

// Mejor: Tabla separada
model StaffCommissionSummary {
  id String @id
  financeSummaryId String
  staffId String
  amount Float
  percentage Float
}
```

### 5.3 **CAMBIOS DE PRECIO NO REGISTRADOS**
```sql
-- ❌ PROBLEMA:
-- Service price cambia de $50 → $100
-- Citas viejas muestran precio snapshot ✓
-- Pero no hay audit trail de cambio

-- Solución: Agregar trigger + historia
ALTER TABLE service ADD COLUMN (
  updatedBy VARCHAR(36),
  updatedAt TIMESTAMP
);

CREATE TABLE service_price_history (
  id VARCHAR(36),
  serviceId VARCHAR(36),
  oldPrice DECIMAL,
  newPrice DECIMAL,
  changedBy VARCHAR(36),
  changedAt TIMESTAMP,
  FOREIGN KEY (serviceId) REFERENCES service(id)
);

-- Y auditar cada INSERT
CREATE TRIGGER audit_service_price
BEFORE UPDATE ON service
FOR EACH ROW
INSERT INTO service_price_history VALUES (
  uuid(), OLD.id, OLD.price, NEW.price, 
  CURRENT_USER(), NOW()
);
```

### 5.4 **RELATIONSHIP: APPOINTMENT.COMBO PUEDE SER NULL**
```prisma
model Appointment {
  comboId         String?
  combo           Combo?    @relation(..., onDelete: SetNull)
}

// ❌ PROBLEMA:
// Cliente pagó por combo completo
// Admin borra combo
// Cita queda con comboId=NULL
// ¿Qué servicios tenía?

// Mejor: onDelete: Restrict
combo       Combo?    @relation(..., onDelete: Restrict)

// O: Soft delete en Combo
model Combo {
  id String
  deletedAt DateTime? // NULL = active
}
```

### 5.5 **AUDLOG CAUSA CASCADA DE DELETES**
```prisma
model AuditLog {
  userId    String
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ❌ PELIGROSO:
// Si borro User → se borran sus AuditLogs
// Pérdida de análisis/compliance

// Mejor: onDelete: Restrict
user      User   @relation(..., onDelete: Restrict)

// O: Anonymous user para deleted accounts
model AuditLog {
  userId    String? // Nullable
  deletedUsername String?
  // Si user fue borrado, shows "Deleted User Admin"
}
```

### 5.6 **NOTIFICATIONV FALTA RETRY LOGIC**
```prisma
model Notification {
  status        String  @default("PENDING")
  errorMessage  String?
  sentAt        DateTime?
  
  // ❌ FALTA:
  // - retryCount
  // - nextRetryAt
  // - errorCode (SMTP_ERROR, RATE_LIMITED, etc.)
  // - channelFailoverPlan
}

// Mejora:
model Notification {
  status        String  @default("PENDING") // PENDING, SENT, FAILED, MAX_RETRIES
  retryCount    Int     @default(0)
  nextRetryAt   DateTime?
  maxRetries    Int     @default(3)
  lastErrorCode String?
  
  @@index([status, nextRetryAt]) // Para job queue
}
```

### 5.7 **IDEMPOTENCY KEY EXPIRATION MANUAL**
```typescript
// ❌ PROBLEMA:
export async function cleanupExpiredIdempotencyKeys() {
  // Cron job manual cada X minutos?
  // Llamado desde dónde?
  // Qué pasa si falla?
}

// Mejor: TTL en BD
model IdempotencyKey {
  key       String @id
  result    String
  expiresAt DateTime // Índice

  @@index([expiresAt])
}

// PostgreSQL:
CREATE TABLE idempotency_key (
  key TEXT PRIMARY KEY,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

-- Drop expired rows automáticamente (PostgreSQL 14+)
ALTER TABLE idempotency_key
SET (
  fillfactor = 70
);

-- O usar pg_cron extension
SELECT cron.schedule(
  'cleanup_idempotency_keys',
  '*/5 * * * *', -- Cada 5 minutos
  'DELETE FROM idempotency_key WHERE expires_at < NOW()'
);
```

### 5.8 **FALTA: SOFT DELETE PATTERN**
```prisma
// ❌ NO HAY:
model Client {
  deletedAt DateTime? // NULL = active
}

model Appointment {
  deletedAt DateTime? // Cancelaciones son lógicas, no físicas
}

// EN PRODUCCIÓN:
// "Borrar" cliente = lose datos históricos (problema legal)
// Mejor: Marcar como deleted, mantener audit trail

// Implementar:
model User {
  deletedAt DateTime?
  
  // En queries:
  // WHERE deletedAt IS NULL (siempre)
}
```

### 5.9 **MISSING CONSTRAINTS**
```sql
-- ❌ FALTAN:
-- 1. Check constraint en prices
ALTER TABLE service 
ADD CONSTRAINT check_service_price CHECK (price > 0);

ALTER TABLE combo 
ADD CONSTRAINT check_combo_price CHECK (price > 0);

ALTER TABLE appointment 
ADD CONSTRAINT check_appointment_dates 
CHECK (endAt > startAt);

-- 2. Unique constraint en operaciones idempotentes
-- ✓ Ya existe: idempotencyKey UNIQUE

-- 3. Foreign keys sin índices
ALTER TABLE appointment 
ADD INDEX idx_appointment_client_id (client_id);
-- ✓ Ya existen

-- 4. Validar que StartAt es futuro
ALTER TABLE appointment 
ADD CONSTRAINT check_future_appointment 
CHECK (startAt > NOW());

-- 5. Enum values
ALTER TABLE notification 
ADD CONSTRAINT check_notification_status 
CHECK (status IN ('PENDING', 'SENT', 'FAILED'));
```

---

## 6. RIESGOS OPERACIONALES & COMPLIANCE 📋

### 6.1 **FALTA: GDPR COMPLIANCE**
```txt
❌ NO IMPLEMENTADO:
- Data subject access requests (DSAR)
- Right to deletion (forget me)
- Data portability
- Breach notification (72 hours)
- Privacy by design
- DPA (Data Processing Agreement)

REQUERIDO:
- Tabla de consentimiento
- Audit trail de acceso a datos
- Anonimización para testing
- Data retention policy
- DPA con proveedores (Brevo, Upstash)

CREATE TABLE consent_log (
  id VARCHAR(36),
  userId STRING,
  type ENUM('marketing', 'analytics', 'notifications'),
  value BOOLEAN,
  recordedAt TIMESTAMP,
  ipAddress STRING
);
```

### 6.2 **FALTA: PCI-DSS (PAGOS)**
```txt
❌ PROBLEMAS:
- Guardando payment logs sin máscara de números
- No hay encriptación de datos de pago
- Rating limiter NO DETECTA patrones de fraude
- Sin logs detallados de transacciones

REQUERIDO:
- No guardar full credit card numbers (NUNCA)
- Usar token de pago (Stripe, Square)
- Enciptación TLS en tránsito (ya tenemos HSTS)
- Audit logs de acceso a datos de pago
- Monitoreo de transacciones sospechosas
- Compliance certificación PCI-DSS Level 1

EN CÓDIGO:
// Nunca hacer:
await db.payment.create({
  cardNumber: "4532111111111111", // ❌❌❌
});

// Hacer:
const token = await stripe.tokens.create({card});
await db.payment.create({
  stripeTokenId: token.id, // ✓
});
```

### 6.3 **MISSING: LOG RETENTION & COMPLIANCE**
```txt
❌ PROBLEMA:
- Logs de console (no persisten)
- Audit logs en BD pero sin rotation
- Sin separate log para security events

REQUERIDO:
- Logs estructurados (JSON)
- Enviados a: Datadog, CloudWatch, Splunk
- Retenidos 90+ días
- Alertas en tiempo real:
  - 5+ failed logins de mismo IP
  - Acceso a datos no autorizados
  - Cambios en configuración crítica
  - Errores 500 frecuentes
```

### 6.4 **FALTA: INCIDENT RESPONSE PLAN**
```txt
❌ NO HAY:
- Playbook para breaches
- Escalation procedures
- Communication templates
- Post-mortem templates
- Backup & disaster recovery tests

CRÍTICO:
- Documentar RTO/RPO
- Realizar disaster recovery drills cada trimestre
- Backup testing automático
```

---

## 7. QUÉ ESTÁ FALLANDO O FALTA ENTERPRISE-LEVEL

### 7.1 **AUTENTICACIÓN & AUTORIZACIÓN** 🔴 FALTA COMPLETAMENTE
```
❌ No existe:
- Middleware de autenticación globalmente aplicado
- Verificación de JWT/Session
- RBAC (Role-based access control)
- Multi-tenancy
- OAuth2 / OpenID Connect
- 2FA / MFA
- API Keys

✓ MÍNIMO requerido:
- Bearer token en Authorization header
- Validar token antes de cada handler
- Verificar permisos según UserRole
- Denegar acceso a datos ajenos
```

### 7.2 **TESTING & OBSERVABILITY** 🔴 FALTA
```
❌ No hay:
- Unit tests
- Integration tests
- Load tests
- Security tests (OWASP ZAP, Burp)
- E2E tests
- APM (Application Performance Monitoring)

✓ REQUERIDO:
- 80%+ code coverage
- Load test mínimo 100 concurrent users
- SAST/DAST en CI/CD
- APM: Datadog, New Relic, o similar
```

### 7.3 **HARDENING DE INFRAESTRUCTURA** 🔴 FALTA
```
❌ No hay evidencia de:
- WAF (Web Application Firewall)
- DDoS protection
- Rate limiting real (Cloudflare, AWS WAF)
- API Gateway
- Secrets management (no hardcoded env vars)
- Container security scanning
- VPC/Network segmentation

✓ REQUERIDA:
- Cloudflare WAF (OWASP Top 10 rules)
- AWS Shield / DDoS mitigation
- Secrets en AWS Secrets Manager, HashiCorp Vault
- API Gateway (AWS API Gateway, Kong)
```

### 7.4 **DATABASES & BACKUP** 🔴 PROBLEMAS
```
❌ ACTUAL:
- Pool de conexiones sin límites configurados
- Sin read replicas para reportes
- Sin backup strategy visible
- Sin point-in-time recovery

✓ REQUERIDO:
- PG connection pooling (pgBouncer): 10-30 connections
- Read replicas para analytics
- Backup automático: diario + semanal
- Replicación multi-región
- Restore testing: mensual
- RTO: < 1 hora
- RPO: < 15 minutos
```

### 7.5 **DEPLOYMENT & RELEASES** 🔴 FALTA
```
❌ No hay:
- CI/CD pipeline
- Automated testing en merge
- Feature flags
- Blue-green deployments
- Canary releases
- Rollback procedures
- Secrets injection en deployment

✓ REQUERIDO:
- GitHub Actions / GitLab CI
- Automated deploy on main branch
- Feature flags (Unleash, LaunchDarkly)
- 0-downtime deployments
```

### 7.6 **MONITORING & ALERTING** 🔴 FALTA
```
❌ NO HAY:
- Error tracking (Sentry, Rollbar)
- Performance monitoring (Datadog)
- Uptime monitoring (StatusPage)
- Database monitoring

✗ Qué pasa si:
- API cae → ¿Quién se entera?
- Database crece a 1TB → sin alerta
- 1000 errores en 1 minuto → missed
- Memory leak → downtime

✓ REQUERIDO:
- Sentry (errors)
- Prometheus + Grafana (metrics)
- AlertManager (notifications)
- Uptime: StatusPage

Alertas críticas:
- Error rate > 1%
- Response time > 1000ms
- CPU > 80%
- Database size growth
- Plan de escalado automático
```

---

## 8. RIESGOS INMEDIATOS A RESOLVER

### 🔴 PRIORIDAD CRÍTICA (Hacer ANTES de cualquier producción)

1. **Implementar autenticación obligatoria**
   - [ ] JWT token generation en /signin
   - [ ] Middleware que valida token en TODOS los endpoints
   - [ ] Denegar requests sin token

2. **Implementar autorización (RBAC)**
   - [ ] Verificar `user.role` en cada operación
   - [ ] Denegar acceso a datos de otros usuarios
   - [ ] Denegar operaciones según rol

3. **Validar inputs completamente**
   - [ ] Agregar max length a strings
   - [ ] Validar dates no estén en pasado
   - [ ] Validar números positivos
   - [ ] Detectar inyección de scripts

4. **Implementar transacciones atómicas**
   - [ ] Usar `db.$transaction()` en operaciones multi-tabla
   - [ ] Prevenir double-booking con LOCK
   - [ ] Rollback automático en error

### 🟠 PRIORIDAD ALTA (Primera semana)

5. **Implementar caching**
   - [ ] Services en Redis (TTL 1h)
   - [ ] Availability slots en Redis (TTL 30min)
   - [ ] Idempotency keys en Redis (TTL 24h)

6. **Agregar índices en BD**
   - [ ] `appointment(staff_id, start_at, status)`
   - [ ] `notification(status, created_at) WHERE status='PENDING'`
   - [ ] Validar explain plans de queries lentas

7. **Configurar rate limiting real**
   - [ ] Aplicar `checkRateLimit()` en todos endpoints
   - [ ] Rate limit por usuario authentificado (después de token)
   - [ ] Detectar abuso (múltiples intentos fallidos)

8. **Encriptación de datos sensibles**
   - [ ] Phone numbers encriptados
   - [ ] Appointment notes encriptados
   - [ ] Key rotation quarterly

### 🟡 PRIORIDAD MEDIA (Primer mes)

9. **Logging & Monitoring**
   - [ ] Sentry para errors
   - [ ] Datadog para metrics
   - [ ] Alert setup

10. **Testing**
    - [ ] 80% coverage en funciones críticas
    - [ ] Load test con 100+ concurrent users
    - [ ] Security tests (OWASP)

11. **Documentación**
    - [ ] OpenAPI/Swagger schema
    - [ ] Runbook de deployment
    - [ ] Incident response plan

---

## 9. CHECKLIST PARA PRODUCCIÓN

```
SEGURIDAD:
- [ ] Autenticación en TODOS endpoints
- [ ] Autorización verificada (RBAC)
- [ ] Rate limiting activo
- [ ] Inputs validados (Zod + custom)
- [ ] HTTPS obligatorio
- [ ] CSP headers setup
- [ ] CORS restrictivo (no *)
- [ ] Secrets en env (no hardcoded)
- [ ] SQL injection test (OWASP)
- [ ] XSS test completado
- [ ] CSRF token validation
- [ ] Encriptación at-rest

PERFORMANCE:
- [ ] Pagination en todas las queries
- [ ] Índices de BD optimizados
- [ ] N+1 queries eliminadas
- [ ] Redis caching activo
- [ ] Pool connections configurado
- [ ] Load test > 100 concurrent ✓
- [ ] Response time < 500ms p95
- [ ] Error rate < 0.1%

RELIABILITY:
- [ ] Transacciones atómicas
- [ ] Error handling global
- [ ] Graceful degradation
- [ ] Circuit breakers
- [ ] Retry logic (4 attempts)
- [ ] Backup daily + test restore
- [ ] RTO < 1 hour defined
- [ ] RPO < 15 min defined

COMPLIANCE:
- [ ] Audit logging completo
- [ ] GDPR items (consent, DSAR)
- [ ] PCI-DSS si maneja pagos
- [ ] Privacy policy updated
- [ ] Incident response plan
- [ ] DPA con vendors
- [ ] Data retention policy

OPERACIONAL:
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Deployment procedure
- [ ] Rollback plan
- [ ] Monitoring setup
- [ ] Alerting configured
- [ ] Runbooks created
- [ ] On-call rotation

DOCUMENTACIÓN:
- [ ] API schema (OpenAPI)
- [ ] Architecture docs
- [ ] Deployment guide
- [ ] Security policies
- [ ] Troubleshooting guide
```

---

## 10. ROADMAP RECOMENDADO

### Fase 1: CRITICAL (Semanas 1-2)
1. Auth middleware + JWT tokens
2. RBAC enforcement
3. Input validation + sanitization
4. Transaciones atómicas para citas/pagos
5. Rate limiting en endpoints

**Salida:** Sistema mínimamente seguro

### Fase 2: ROBUSTNESS (Semanas 3-4)
6. Redis caching
7. Índices de BD
8. Error handling global
9. Audit logging completo
10. Load testing

**Salida:** Sistema escalable hasta 100 requests/sec

### Fase 3: ENTERPRISE (Semana 5-6+)
11. Monitoring & alerts
12. CI/CD automation
13. GDPR/PCI compliance
14. Disaster recovery
15. Documentation

**Salida:** Enterprise-ready system

---

## CONCLUSIÓN

**Estado Actual:** PRE-ALPHA, NO APTO PARA PRODUCCIÓN

Tu sistema tiene buena estructura base pero **falta seguridad crítica**. El riesgo más grande es que **cualquiera puede hacer cualquier cosa** (crear citas, procesar pagos, ver datos ajenos).

Antes de pasar a producción, requisitos mínimos:
1. ✅ Autenticación obligatoria
2. ✅ Autorización verificada
3. ✅ Validaciones completasantes
4. ✅ Transacciones atómicas
5. ✅ Rate limiting activo
6. ✅ Monitoring real-time
7. ✅ Backup & restore testing

**Tiempo estimado para Enterprise-ready:** 4-6 semanas con 2 engineers

¿Necesitas que implemente cualquiera de estos items?
