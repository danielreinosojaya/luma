import { z } from "zod";

// ============= AUTH =============

export const signUpSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  name: z.string().min(2, "Nombre mínimo 2 caracteres"),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, "Teléfono inválido"),
});

export const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string(),
});

// ============= CLIENTS =============

export const createClientSchema = z.object({
  name: z.string().min(2, "Nombre mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, "Teléfono inválido"),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

// ============= SERVICES =============

export const createServiceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(["HAIR", "NAILS", "BROWS", "LASHES"]),
  durationMin: z.number().int().min(15),
  price: z.number().positive("Precio debe ser positivo"),
  active: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

// ============= COMBOS =============

export const createComboSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  discountPct: z.number().min(0).max(100).default(0),
  serviceIds: z.array(z.string()).min(1, "Al menos un servicio"),
  active: z.boolean().default(true),
});

export const updateComboSchema = createComboSchema.omit({ serviceIds: true }).partial();

// ============= STAFF =============

export const createStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().min(2), // "hairStylist", "nailTechnician", etc.
  commissionRate: z.number().min(0).max(1).default(0.15),
  serviceIds: z.array(z.string()).min(1, "Al menos un servicio"),
});

export const createStaffScheduleSchema = z.object({
  staffId: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  isAvailable: z.boolean().default(true),
});

// ============= APPOINTMENTS =============

export const createAppointmentSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().regex(/^\+?[\d\s\-()]{10,}$/),
  staffId: z.string(),
  serviceIds: z.array(z.string()).min(1), // Servicios individuales
  comboId: z.string().optional(), // O combo (excluyente con serviceIds)
  startAt: z.string().datetime("Formato ISO datetime requerido"),
  notes: z.string().optional(),
  idempotencyKey: z.string().min(1, "Idempotency key requerida"),
});

export const updateAppointmentSchema = z.object({
  startAt: z.string().datetime().optional(),
  staffId: z.string().optional(),
  notes: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().optional(),
});

// ============= PAYMENTS =============

export const createPaymentSchema = z.object({
  appointmentId: z.string(),
  method: z.enum(["CASH", "CARD", "TRANSFER"]),
  notes: z.string().optional(),
  idempotencyKey: z.string().min(1, "Idempotency key requerida"),
});

// ============= AVAILABILITY =============

export const checkAvailabilitySchema = z.object({
  staffId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD"),
  serviceIds: z.array(z.string()).min(1),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
