import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validators/schemas";
import { getUserByEmail, hashPassword } from "@/lib/auth/helpers";
import { generateTokenPair } from "@/lib/auth/jwt";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/auth/middleware";
import { encrypt } from "@/lib/security/crypto";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Rate limit: 10 signups per minute per IP
    const { success: rlOk } = await checkRateLimit(`auth:signup:${ip}`, "auth");
    if (!rlOk) {
      return NextResponse.json(
        apiError("Too many requests. Try again later.", "RATE_LIMIT_EXCEEDED"),
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v || []])
      );
      return NextResponse.json(validationError(errors), { status: 400 });
    }

    const data = parsed.data;

    // Check if user already exists
    const existing = await getUserByEmail(data.email);
    if (existing) {
      return NextResponse.json(
        apiError("Email already registered", "CONFLICT"),
        { status: 409 }
      );
    }

    // Atomic transaction: create User + Client profile together
    const passwordHash = await hashPassword(data.password);

    const result = await db.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          passwordHash,
          name: data.name.trim(),
          role: "CLIENT",
        },
      });

      const client = await tx.client.create({
        data: {
          userId: user.id,
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          phone: encrypt(data.phone), // PII encrypted at rest
        },
      });

      return { user, client };
    });

    // Generate JWT token pair
    const tokens = await generateTokenPair({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    // Persist session
    await db.session.create({
      data: {
        userId: result.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(
      apiSuccess({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/v1/auth/signup error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      body: error,
    });
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
