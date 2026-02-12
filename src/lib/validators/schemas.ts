import { z } from "zod";

// ============= SHARED REFINEMENTS =============

const safeString = (min: number, max: number, label: string) =>
  z
    .string()
    .min(min, `${label}: mínimo ${min} caracteres`)
    .max(max, `${label}: máximo ${max} caracteres`)
    .transform((s) => s.trim());

const emailField = z
  .string()
  .email("Email inválido")
  .max(254, "Email demasiado largo")
  .transform((e) => e.toLowerCase().trim());

const phoneField = z
  .string()
  .regex(
    /^\+?[\d\s\-()]{10,15}$/,
    "Teléfono inválido (10-15 dígitos, formato internacional permitido)"
  );

const cuidField = z
  .string()
  .min(1, "ID requerido")
  .max(30, "ID inválido");

// ============= AUTH =============

export const signUpSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(128, "Máximo 128 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),
  name: safeString(2, 100, "Nombre"),
  phone: phoneField,
});

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Contraseña requerida").max(128),
});

// ============= CLIENTS =============

export const createClientSchema = z.object({
  name: safeString(2, 100, "Nombre"),
  email: emailField,
  phone: phoneField,
  notes: z.string().max(1000, "Notas máximo 1000 caracteres").optional(),
});

export const updateClientSchema = createClientSchema.partial();

// ============= SERVICES =============

export const createServiceSchema = z.object({
  name: safeString(2, 100, "Nombre"),
  description: z.string().max(500, "Descripción máximo 500 caracteres").optional(),
  category: z.enum(["HAIR", "NAILS", "BROWS", "LASHES"]),
  durationMin: z.number().int().min(15, "Mínimo 15 minutos").max(480, "Máximo 8 horas"),
  price: z
    .number()
    .positive("Precio debe ser positivo")
    .finite()
    .max(99999, "Precio máximo $99,999"),
  active: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

// ============= COMBOS =============

export const createComboSchema = z.object({
  name: safeString(2, 100, "Nombre"),
  description: z.string().max(500).optional(),
  price: z.number().positive().finite().max(99999),
  discountPct: z.number().min(0).max(100).default(0),
  serviceIds: z
    .array(cuidField)
    .min(1, "Al menos un servicio")
    .max(20, "Máximo 20 servicios"),
  active: z.boolean().default(true),
});

export const updateComboSchema = createComboSchema
  .omit({ serviceIds: true })
  .partial();

// ============= STAFF =============

export const createStaffSchema = z.object({
  name: safeString(2, 100, "Nombre"),
  email: emailField,
  password: z.string().min(8).max(128),
  role: safeString(2, 50, "Rol"), // "hairStylist", "nailTechnician", etc.
  commissionRate: z.number().min(0).max(1).default(0.15),
  serviceIds: z
    .array(cuidField)
    .min(1, "Al menos un servicio")
    .max(50, "Máximo 50 servicios"),
});

export const createStaffScheduleSchema = z.object({
  staffId: cuidField,
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  isAvailable: z.boolean().default(true),
});

// ============= APPOINTMENTS =============

export const createAppointmentSchema = z
  .object({
    clientName: safeString(2, 100, "Nombre cliente"),
    clientEmail: emailField,
    clientPhone: phoneField,
    staffId: cuidField,
    serviceIds: z
      .array(cuidField)
      .min(1, "Al menos un servicio")
      .max(10, "Máximo 10 servicios por cita"),
    comboId: cuidField.optional(),
    startAt: z.string().datetime("Formato ISO datetime requerido"),
    notes: z.string().max(500, "Notas máximo 500 caracteres").optional(),
    idempotencyKey: z
      .string()
      .min(1, "Idempotency key requerida")
      .max(64, "Idempotency key máximo 64 caracteres"),
  })
  .refine(
    (data) => new Date(data.startAt) > new Date(),
    { message: "No se puede agendar en el pasado", path: ["startAt"] }
  );

export const updateAppointmentSchema = z.object({
  startAt: z.string().datetime().optional(),
  staffId: cuidField.optional(),
  notes: z.string().max(500).optional(),
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().max(500, "Razón máximo 500 caracteres").optional(),
});

// ============= PAYMENTS =============

export const createPaymentSchema = z.object({
  appointmentId: cuidField,
  method: z.enum(["CASH", "CARD", "TRANSFER"]),
  notes: z.string().max(500).optional(),
  idempotencyKey: z
    .string()
    .min(1, "Idempotency key requerida")
    .max(64, "Idempotency key máximo 64 caracteres"),
});

// ============= AVAILABILITY =============

export const checkAvailabilitySchema = z.object({
  staffId: cuidField,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD"),
  serviceIds: z.array(cuidField).min(1).max(20),
});

// ============= TYPE EXPORTS =============

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
