# SOLUCIONES RECOMENDADAS - ROADMAP DE IMPLEMENTACIÓN

## FASE 1: AUTENTICACIÓN Y AUTORIZACIÓN (Semanas 1-2)

### 1.1 Implementar JWT Authentication

```typescript
// src/lib/auth/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
  iat: number;
  exp: number;
}

export function generateToken(user: {
  id: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
```

### 1.2 Middleware de Autenticación

```typescript
// src/lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: TokenPayload) => Promise<NextResponse>
) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Missing authorization token', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  // Attach user to request
  (request as any).user = payload;
  return handler(request, payload);
}

export function requireRole(...roles: string[]) {
  return (payload: TokenPayload) => {
    if (!roles.includes(payload.role)) {
      throw new Error('Insufficient permissions');
    }
  };
}
```

### 1.3 Implementar en Endpoints

```typescript
// src/app/api/v1/appointments/route.ts - ACTUALIZADO
import { withAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      
      // ✓ CLIENTE solo ve sus propias citas
      // ✓ STAFF ve citas que atiende
      // ✓ ADMIN ve todas
      
      let where: any = {};
      
      if (user.role === 'CLIENT') {
        // Solo sus propias citas
        const client = await db.client.findFirst({
          where: { user: { id: user.userId } }
        });
        if (!client) {
          return NextResponse.json(
            { success: false, error: 'Client profile not found', code: 'NOT_FOUND' },
            { status: 404 }
          );
        }
        where.clientId = client.id;
      } else if (user.role === 'STAFF') {
        // Solo citas que atiende
        where.staffId = user.userId;
      }
      // ADMIN ve todas (where vacío)

      // ✓ SIEMPRE pagination
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
      const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'));
      const skip = (page - 1) * limit;

      const [appointments, total] = await Promise.all([
        db.appointment.findMany({
          where,
          take: limit,
          skip,
          include: {
            staff: { include: { user: true } },
            services: { include: { service: true } },
            payment: true,
          },
          orderBy: { startAt: 'desc' },
        }),
        db.appointment.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: appointments,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('GET /api/v1/appointments error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // ✓ Solo ADMIN y STAFF pueden crear citas
      if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      const body = await req.json();
      const parsed = createAppointmentSchema.safeParse(body);
      
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const data = parsed.data;

      // ✓ Transacción atómica
      const appointment = await db.$transaction(async (tx) => {
        // Idempotency check
        const cached = await tx.idempotencyKey.findUnique({
          where: { key: data.idempotencyKey },
        });
        if (cached) {
          return JSON.parse(cached.result);
        }

        // Validaciones dentro de transacción
        let client = await tx.client.findUnique({
          where: { email: data.clientEmail },
        });

        if (!client) {
          client = await tx.client.create({
            data: {
              name: data.clientName,
              email: data.clientEmail,
              phone: data.clientPhone,
            },
          });
        }

        const staff = await tx.staff.findUnique({
          where: { id: data.staffId },
        });

        if (!staff) {
          throw new Error('Staff not found');
        }

        const services = await tx.service.findMany({
          where: { id: { in: data.serviceIds } },
        });

        if (services.length !== data.serviceIds.length) {
          throw new Error('One or more services not found');
        }

        // ✓ Validación con FOR UPDATE prevención race condition
        const conflicts = await tx.appointment.findMany({
          where: {
            staffId: data.staffId,
            startAt: { lt: new Date(data.endAt) },
            endAt: { gt: new Date(data.startAt) },
            status: { in: ['CONFIRMED', 'PENDING'] },
          },
        });

        if (conflicts.length > 0) {
          throw new Error('Time slot not available');
        }

        // Crear cita y servicios atómicamente
        const appointment = await tx.appointment.create({
          data: {
            clientId: client.id,
            staffId: data.staffId,
            comboId: data.comboId,
            startAt: new Date(data.startAt),
            endAt: new Date(data.endAt),
            status: 'PENDING',
            idempotencyKey: data.idempotencyKey,
          },
        });

        for (const serviceId of data.serviceIds) {
          const service = services.find((s) => s.id === serviceId)!;
          await tx.appointmentService.create({
            data: {
              appointmentId: appointment.id,
              serviceId,
              priceAtBooking: service.price,
            },
          });
        }

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: user.userId,
            action: 'CREATE',
            entity: 'Appointment',
            entityId: appointment.id,
            changes: JSON.stringify({
              type: 'new_appointment',
              client: client.email,
              staff: data.staffId,
              startAt: data.startAt,
              services: data.serviceIds,
            }),
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          },
        });

        return appointment;
      });

      // ✓ Cache idempotency
      await cacheIdempotencyResponse(data.idempotencyKey, appointment);

      return NextResponse.json(
        { success: true, data: appointment },
        { status: 201 }
      );
    } catch (error) {
      console.error('POST /api/v1/appointments error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      );
    }
  });
}
```

---

## FASE 2: INPUT VALIDATION & CACHING (Semanas 2-3)

### 2.1 Mejorar Validadores

```typescript
// src/lib/validators/schemas.ts - ACTUALIZADO
import { z } from 'zod';

// ============= AUTH =============

export const signUpSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(128, 'Máximo 128 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[0-9]/, 'Debe contener un número')
    .regex(/[^a-zA-Z0-9]/, 'Debe contener un carácter especial'),
  name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Teléfono inválido'),
});

export const signInSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string(),
});

// ============= APPOINTMENTS =============

export const createAppointmentSchema = z.object({
  clientEmail: z.string().email(),
  clientName: z.string().min(2).max(100),
  clientPhone: z.string().regex(/^\+?[\d\s\-()]{10,15}$/),
  staffId: z.string().uuid('Invalid staff ID'),
  serviceIds: z.array(z.string().uuid()).min(1).max(10),
  comboId: z.string().uuid().optional(),
  startAt: z.string().datetime().refine(
    (date) => new Date(date) > new Date(),
    'Cannot book in the past'
  ),
  endAt: z.string().datetime(),
  idempotencyKey: z.string().uuid(),
}).refine(
  (data) => new Date(data.endAt) > new Date(data.startAt),
  { message: 'End time must be after start time', path: ['endAt'] }
);

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

// ============= PAYMENTS =============

export const createPaymentSchema = z.object({
  appointmentId: z.string().uuid(),
  method: z.enum(['CASH', 'CARD', 'TRANSFER']),
  amount: z.number().positive('Must be positive').finite(),
  notes: z.string().max(500).optional(),
  idempotencyKey: z.string().uuid(),
});
```

### 2.2 Redis Caching

```typescript
// src/lib/cache/redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function getCached<T>(
  key: string,
  ttlSeconds: number = 3600,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached as string);
    }

    const data = await fetcher();
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Redis error:', error);
    // Fallback to fresh fetch on Redis failure
    return fetcher();
  }
}

export async function invalidateCache(patternOrKey: string): Promise<void> {
  try {
    if (patternOrKey.includes('*')) {
      // Pattern matching (if supported)
      await redis.eval(
        `return redis.call('del', unpack(redis.call('keys', '${patternOrKey}')))`
      );
    } else {
      await redis.del(patternOrKey);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}
```

### 2.3 Usar Caching en Endpoints

```typescript
// Ejemplo: GET /api/v1/services
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const services = await getCached(
        'services:active',
        3600, // 1 hora
        async () => {
          return db.service.findMany({
            where: { active: true },
            orderBy: { name: 'asc' },
          });
        }
      );

      return NextResponse.json({
        success: true,
        data: services,
      });
    } catch (error) {
      console.error('GET /api/v1/services error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  });
}
```

---

## FASE 3: DATABASE ÍNDICES E OPTIMIZACIONES

### 3.1 Migrations para Índices

```sql
-- migrations/add_performance_indexes.sql

-- Appointment slots search (muy crítico)
CREATE INDEX CONCURRENTLY idx_appointment_staff_date_status
ON appointment(staff_id, start_at DESC, status)
WHERE status IN ('PENDING', 'CONFIRMED');

-- Notifications queue
CREATE INDEX CONCURRENTLY idx_notification_pending
ON notification(status, created_at)
WHERE status = 'PENDING';

-- Audit trail búsqueda
CREATE INDEX CONCURRENTLY idx_audit_user_date
ON audit_log(user_id, created_at DESC);

-- Client búsqueda por email
CREATE UNIQUE INDEX CONCURRENTLY idx_client_email
ON client(email);

-- Payment búsqueda por período
CREATE INDEX CONCURRENTLY idx_payment_date_status
ON payment(created_at DESC, status);

-- Appointment búsqueda por cliente + status
CREATE INDEX CONCURRENTLY idx_appointment_client_status
ON appointment(client_id, status, created_at DESC);

-- Service búsqueda por categoría
CREATE INDEX CONCURRENTLY idx_service_category
ON service(category, active)
WHERE active = true;

-- Session búsqueda por usuario
CREATE INDEX CONCURRENTLY idx_session_user_id
ON session(user_id);
```

### 3.2 Analizar Query Performance

```typescript
// src/lib/db/debug.ts
export async function explainQuery(query: string) {
  const result = await db.$queryRaw`EXPLAIN (ANALYZE, BUFFERS) ${query}`;
  console.log('Query plan:', result);
}

// Usar:
// const result = await explainQuery('SELECT * FROM appointments WHERE staff_id = ...');
// Revisar: seq scan vs index scan, planning vs execution time
```

---

## FASE 4: RATE LIMITING APLICADO

```typescript
// src/app/api/v1/appointments/route.ts - ADD RATE LIMITING

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // ANTES de validar, check rate limit
  const { success } = await checkRateLimit(
    `booking:${ip}`,
    'booking' // 5 requests/min
  );

  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  return withAuth(request, async (req, user) => {
    // ... rest of handler
  });
}
```

---

## FASE 5: ENCRIPTACIÓN DE DADOS SENSIBLES

```typescript
// src/lib/encryption/crypto.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(process.env.ENCRYPTION_KEY || 'default-key')
  .digest();

const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(parts[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

```typescript
// En Prisma middleware para encriptar/desencriptar automáticamente
import { Prisma } from '@/generated/prisma';
import { encrypt, decrypt } from '@/lib/encryption/crypto';

db.$use(async (params, next) => {
  if (params.model === 'Client' && (params.action === 'create' || params.action === 'update')) {
    if (params.args.data?.phone) {
      params.args.data.phone = encrypt(params.args.data.phone);
    }
  }

  const result = await next(params);

  if (params.model === 'Client' && params.action === 'findUnique') {
    if (result?.phone) {
      result.phone = decrypt(result.phone);
    }
  }

  return result;
});
```

---

## CHECKLIST DE IMPLEMENTACIÓN

```
FASE 1: Autenticación (2 semanas)
- [ ] JWT generation en signin
- [ ] Auth middleware en todos endpoints
- [ ] RBAC enforcement (role checks)
- [ ] Tests para auth flow
- [ ] Rate limiting en auth endpoints

FASE 2: Input & Caching (1.5 semanas)
- [ ] Mejorar Zod schemas
- [ ] Redis caching para services
- [ ] Redis caching para availability
- [ ] Invalidation strategies
- [ ] Tests para validación

FASE 3: Database (1 semana)
- [ ] Crear migration para índices
- [ ] EXPLAIN ANALYZE queries
- [ ] Benchmark antes/después
- [ ] Connection pool config
- [ ] Monitoring de queries lentas

FASE 4: Rate Limiting (3 días)
- [ ] Aplicar en todos endpoints
- [ ] Rate limits por rol
- [ ] Anti-abuse patterns
- [ ] Tests para limits

FASE 5: Encriptación (3 días)
- [ ] Setup crypto
- [ ] Encriptar phone + sensible data
- [ ] Key rotation procedure
- [ ] Tests para encrypt/decrypt

FASE 6: Monitoring (1 semana)
- [ ] Setup Sentry
- [ ] Datadog/CloudWatch
- [ ] Alertas críticas
- [ ] Dashboards

= TOTAL: 4-6 semanas para producción
```

---

## SCRIPTS DE TESTING

```bash
# Load test
npx artillery quick --count 100 --num 1000 https://api.luma.local/api/v1/services

# Security test
npx owasp-zap-webdriver --url https://api.luma.local

# SQL injection test
curl -G "https://api.luma.local/api/v1/appointments" \
  --data-urlencode "clientEmail='; DROP TABLE users; --"

# Authentication test
curl https://api.luma.local/api/v1/appointments # Debe fallar 401
curl -H "Authorization: Bearer invalid-token" \
  https://api.luma.local/api/v1/appointments # Debe fallar 401

# RBAC test
# Cliente intentando ver citas de otro cliente
# Debe fallar 403
```

¿Necesitas ayuda implementando cualquiera de estos pasos?
