import { NextResponse } from "next/server";

// ============= INTERFACES =============

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============= ERROR CODES =============

export const ErrorCode = {
  // Client errors (4xx)
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  IDEMPOTENCY_CONFLICT: "IDEMPOTENCY_CONFLICT",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",

  // Business logic errors
  APPOINTMENT_CONFLICT: "APPOINTMENT_CONFLICT",
  APPOINTMENT_NOT_CANCELLABLE: "APPOINTMENT_NOT_CANCELLABLE",
  PAYMENT_ALREADY_EXISTS: "PAYMENT_ALREADY_EXISTS",
  INVALID_APPOINTMENT_STATUS: "INVALID_APPOINTMENT_STATUS",
  STAFF_UNAVAILABLE: "STAFF_UNAVAILABLE",
  SERVICE_INACTIVE: "SERVICE_INACTIVE",

  // Server errors (5xx)
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DB_ERROR: "DB_ERROR",
  EMAIL_ERROR: "EMAIL_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

// ============= SUCCESS HELPERS =============

export function apiSuccess<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function apiPaginated<T>(
  data: T[],
  meta: PaginationMeta,
  message?: string
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta,
    message,
  };
}

// ============= ERROR HELPERS =============

export function apiError(
  error: string,
  code: ErrorCodeType | (string & {}) = ErrorCode.INTERNAL_ERROR,
  message?: string
): ApiResponse {
  return {
    success: false,
    error,
    code,
    message,
  };
}

export function validationError(
  errors: Record<string, string[]>
): ApiResponse {
  return {
    success: false,
    error: "Validation failed",
    code: ErrorCode.VALIDATION_ERROR,
    data: errors,
  };
}

// ============= EXCEPTION CLASS =============

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public response: ApiResponse
  ) {
    super(response.error);
    this.name = "ApiException";
  }

  static badRequest(error: string, code: ErrorCodeType = ErrorCode.VALIDATION_ERROR) {
    return new ApiException(400, apiError(error, code));
  }

  static unauthorized(error = "Authentication required") {
    return new ApiException(401, apiError(error, ErrorCode.UNAUTHORIZED));
  }

  static forbidden(error = "Insufficient permissions") {
    return new ApiException(403, apiError(error, ErrorCode.FORBIDDEN));
  }

  static notFound(entity = "Resource") {
    return new ApiException(404, apiError(`${entity} not found`, ErrorCode.NOT_FOUND));
  }

  static conflict(error: string, code: ErrorCodeType = ErrorCode.CONFLICT) {
    return new ApiException(409, apiError(error, code));
  }

  static rateLimited(error = "Too many requests") {
    return new ApiException(429, apiError(error, ErrorCode.RATE_LIMITED));
  }

  static internal(error = "Internal server error") {
    return new ApiException(500, apiError(error, ErrorCode.INTERNAL_ERROR));
  }
}

// ============= GLOBAL ERROR HANDLER =============

/**
 * Wraps a route handler with standardized error handling.
 * Catches ApiException, Zod errors, Prisma errors, and unknown errors.
 * In production, sanitizes error messages to prevent information leakage.
 */
export function withErrorHandler(
  handler: (request: Request, context?: any) => Promise<NextResponse>
) {
  return async (request: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

function handleError(error: unknown): NextResponse {
  const isProd = process.env.NODE_ENV === "production";

  // Known API exceptions
  if (error instanceof ApiException) {
    return NextResponse.json(error.response, { status: error.statusCode });
  }

  // Zod validation errors
  if (isZodError(error)) {
    const formatted = formatZodError(error);
    return NextResponse.json(
      validationError(formatted),
      { status: 400 }
    );
  }

  // Prisma known request errors (constraint violations, not found, etc.)
  if (isPrismaError(error)) {
    return handlePrismaError(error, isProd);
  }

  // Unknown errors — sanitize in production
  const message = isProd
    ? "An unexpected error occurred"
    : error instanceof Error
      ? error.message
      : "Unknown error";

  if (!isProd) {
    console.error("[API Error]", error);
  }

  return NextResponse.json(
    apiError(message, ErrorCode.INTERNAL_ERROR),
    { status: 500 }
  );
}

// ============= PRISMA ERROR HANDLING =============

interface PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: Record<string, unknown>;
}

function isPrismaError(error: unknown): error is PrismaClientKnownRequestError {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as any).code === "string" &&
    (error as any).code.startsWith("P")
  );
}

function handlePrismaError(
  error: PrismaClientKnownRequestError,
  isProd: boolean
): NextResponse {
  switch (error.code) {
    case "P2002": {
      // Unique constraint violation
      const target = (error.meta?.target as string[])?.join(", ") || "field";
      return NextResponse.json(
        apiError(
          `A record with that ${target} already exists`,
          ErrorCode.CONFLICT
        ),
        { status: 409 }
      );
    }
    case "P2025":
      // Record not found
      return NextResponse.json(
        apiError("Record not found", ErrorCode.NOT_FOUND),
        { status: 404 }
      );
    case "P2003":
      // Foreign key constraint failure
      return NextResponse.json(
        apiError("Referenced record does not exist", ErrorCode.VALIDATION_ERROR),
        { status: 400 }
      );
    case "P2024":
      // Connection pool timeout
      return NextResponse.json(
        apiError(
          isProd ? "Service temporarily unavailable" : "Database pool timeout",
          ErrorCode.DB_ERROR
        ),
        { status: 503 }
      );
    default:
      return NextResponse.json(
        apiError(
          isProd ? "A database error occurred" : `Prisma error ${error.code}: ${error.message}`,
          ErrorCode.DB_ERROR
        ),
        { status: 500 }
      );
  }
}

// ============= ZOD ERROR HANDLING =============

interface ZodIssue {
  path: (string | number)[];
  message: string;
}

function isZodError(error: unknown): error is Error & { issues: ZodIssue[] } {
  return error instanceof Error && "issues" in error && Array.isArray((error as any).issues);
}

function formatZodError(error: Error & { issues: ZodIssue[] }): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }
  return formatted;
}
