import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { UserRole } from "@/generated/prisma/enums";

// ============= TYPES =============

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}

// ============= CONFIG =============

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "CHANGE_ME_IN_PRODUCTION_32_CHARS!"
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "CHANGE_ME_REFRESH_IN_PRODUCTION!"
);

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";
const ISSUER = "luma-api";
const AUDIENCE = "luma-client";

// ============= GENERATE =============

export async function generateTokenPair(user: {
  id: string;
  email: string;
  role: UserRole;
}): Promise<TokenPair> {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 15 * 60; // 15 minutes

  const accessToken = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  } satisfies TokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  } satisfies TokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(REFRESH_SECRET);

  return { accessToken, refreshToken, expiresAt };
}

// ============= VERIFY =============

export async function verifyAccessToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
