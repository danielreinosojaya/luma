import { NextRequest, NextResponse } from "next/server";
import { signInSchema } from "@/lib/validators/schemas";
import { getUserByEmail, verifyPassword } from "@/lib/auth/helpers";
import { generateTokenPair } from "@/lib/auth/jwt";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/auth/middleware";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Rate limit: 10 auth attempts per minute per IP
    const { success: rlOk } = await checkRateLimit(`auth:signin:${ip}`, "auth");
    if (!rlOk) {
      return NextResponse.json(
        apiError("Too many login attempts. Try again later.", "RATE_LIMIT_EXCEEDED"),
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v || []])
      );
      return NextResponse.json(validationError(errors), { status: 400 });
    }

    const data = parsed.data;

    // Get user — timing-safe: always hash-compare even when user not found
    const user = await getUserByEmail(data.email);
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        apiError("Invalid email or password", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        apiError("Account is deactivated", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(data.password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        apiError("Invalid email or password", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // Generate JWT token pair (access + refresh)
    const tokens = await generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Persist session in DB for revocation support
    await db.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days (refresh TTL)
      },
    });

    return NextResponse.json(
      apiSuccess({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        },
      })
    );
  } catch (error) {
    console.error("POST /api/v1/auth/signin error:", error);
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
