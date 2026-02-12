import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * Proxy handler for API requests
 * Replaces deprecated middleware.ts pattern in Next.js 16
 * Handles:
 * - Rate limiting by IP
 * - CORS headers
 * - Security headers
 */
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

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Rate limiting by IP
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // More aggressive rate limiting for auth & booking
  let rateLimitType: "public" | "auth" | "api" | "booking" = "public";
  if (pathname.includes("/api/auth")) {
    rateLimitType = "auth";
  } else if (pathname.includes("/api/appointments")) {
    rateLimitType = "booking";
  } else if (pathname.startsWith("/api/")) {
    rateLimitType = "api";
  }

  const rateLimitKey = `${ip}:${pathname}`;
  const { success, reset } = await checkRateLimit(rateLimitKey, rateLimitType);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests",
        code: "RATE_LIMIT_EXCEEDED",
        reset,
      },
      { status: 429 }
    );
  }

  // Create response with security headers
  const response = NextResponse.next();

  // CORS headers
  response.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_APP_URL || "*"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Idempotency-Key"
  );

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  return response;
}
