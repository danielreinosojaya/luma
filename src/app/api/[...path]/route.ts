import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * Proxy handler for API requests
 * Replaces deprecated middleware.ts pattern in Next.js 16
 * Handles:
 * - Rate limiting by IP
 * - CORS headers with origin validation
 * - CSRF protection (Origin/Referer check on mutations)
 * - Security headers (CSP, HSTS, X-Frame-Options, etc.)
 */

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_APP_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const MUTATION_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

// ============= ROUTE HANDLERS =============

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  // Preflight CORS — respond immediately
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = resolveAllowedOrigin(origin);

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Idempotency-Key",
      "Access-Control-Max-Age": "86400", // 24h preflight cache
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

// ============= MAIN HANDLER =============

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // --- CSRF Protection for mutation methods ---
  if (MUTATION_METHODS.has(request.method)) {
    const csrfError = validateOrigin(request);
    if (csrfError) {
      return NextResponse.json(
        {
          success: false,
          error: csrfError,
          code: "CSRF_REJECTED",
        },
        { status: 403 }
      );
    }
  }

  // --- Rate limiting by IP ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  let rateLimitType: "public" | "auth" | "api" | "booking" = "public";
  if (pathname.includes("/api/v1/auth")) {
    rateLimitType = "auth";
  } else if (pathname.includes("/api/v1/appointments")) {
    rateLimitType = "booking";
  } else if (pathname.startsWith("/api/")) {
    rateLimitType = "api";
  }

  const rateLimitKey = `${ip}:${rateLimitType}`;
  const { success, reset } = await checkRateLimit(rateLimitKey, rateLimitType);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: reset,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    );
  }

  // --- Forward request with security headers ---
  const response = NextResponse.next();
  applySecurityHeaders(response, request);

  return response;
}

// ============= CSRF / ORIGIN VALIDATION =============

function validateOrigin(request: NextRequest): string | null {
  // Skip CSRF in development
  if (process.env.NODE_ENV === "development") return null;

  // Skip if no allowed origins configured (misconfiguration — fail open with warning)
  if (ALLOWED_ORIGINS.length === 0) {
    console.warn("[CSRF] No ALLOWED_ORIGINS configured — skipping origin check");
    return null;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // At least one must be present for mutation requests
  if (!origin && !referer) {
    return "Missing Origin/Referer header";
  }

  const requestOrigin = origin || new URL(referer!).origin;

  if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
    return "Origin not allowed";
  }

  return null;
}

function resolveAllowedOrigin(origin: string): string {
  if (ALLOWED_ORIGINS.length === 0) return origin || "*";
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

// ============= SECURITY HEADERS =============

function applySecurityHeaders(response: NextResponse, request: NextRequest): void {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = resolveAllowedOrigin(origin);

  // CORS
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Idempotency-Key");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Anti-clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS protection (legacy but still useful for older browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // HSTS — force HTTPS for 1 year
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Content Security Policy — strict for API responses
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'"
  );

  // Referrer Policy — don't leak URLs
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy — disable unnecessary browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Don't cache API responses by default
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  response.headers.set("Pragma", "no-cache");
}
