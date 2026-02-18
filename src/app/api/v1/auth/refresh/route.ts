import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateTokenPair } from "@/lib/auth/jwt";
import { apiSuccess, apiError } from "@/lib/api/response";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/auth/middleware";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const { success: rlOk } = await checkRateLimit(`auth:refresh:${ip}`, "auth");
    if (!rlOk) {
      return NextResponse.json(
        apiError("Demasiadas solicitudes", "RATE_LIMIT_EXCEEDED"),
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        apiError("Falta el token de actualización", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        apiError("Token de actualización inválido o expirado", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // Verify user still active
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, active: true },
    });

    if (!user || !user.active) {
      return NextResponse.json(
        apiError("Cuenta desactivada", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // Generate new token pair (token rotation)
    const tokens = await generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      apiSuccess({
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
        },
      })
    );
  } catch (error) {
    console.error("POST /api/v1/auth/refresh error:", error);
    return NextResponse.json(
      apiError("Ocurrió un error inesperado", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
