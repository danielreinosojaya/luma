import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth/jwt";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api/response";
import type { UserRole } from "@/generated/prisma/enums";

// ============= TYPES =============

/** Extended request carrying the authenticated user data. */
export interface AuthenticatedRequest extends NextRequest {
  /** Populated by withAuth after token verification. */
  auth: TokenPayload & { staffId?: string; clientId?: string };
}

type AuthHandler = (
  request: AuthenticatedRequest,
  context?: any
) => Promise<NextResponse>;

// ============= CORE MIDDLEWARE =============

/**
 * Wraps a route handler requiring a valid JWT.
 * Attaches `request.auth` with the decoded token payload enriched with
 * staffId / clientId when available.
 */
export function withAuth(handler: AuthHandler) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // 1. Extract token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        apiError("Missing authorization token", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // 2. Verify JWT
    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        apiError("Invalid or expired token", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // 3. Verify user still active in DB (prevents use of tokens from
    //    deleted / deactivated accounts – small DB hit but critical for
    //    enterprise security).
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        active: true,
        role: true,
        staff: { select: { id: true } },
        client: { select: { id: true } },
      },
    });

    if (!user || !user.active) {
      return NextResponse.json(
        apiError("Account deactivated or not found", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // 4. Attach enriched auth to request
    const authData = {
      ...payload,
      role: user.role, // always use DB role (source of truth)
      staffId: user.staff?.id,
      clientId: user.client?.id,
    };

    (request as AuthenticatedRequest).auth = authData;

    return handler(request as AuthenticatedRequest, context);
  };
}

// ============= RBAC HELPERS =============

/**
 * Wraps a route handler that requires one of the specified roles.
 * Must be used AFTER withAuth.
 */
export function requireRole(...roles: UserRole[]) {
  return (handler: AuthHandler): AuthHandler => {
    return async (request, context) => {
      if (!roles.includes(request.auth.role)) {
        return NextResponse.json(
          apiError("Insufficient permissions", "FORBIDDEN"),
          { status: 403 }
        );
      }
      return handler(request, context);
    };
  };
}

/**
 * Ensures the requesting user can only access their own resources.
 * Admins bypass this check.
 */
export function requireOwnership(
  getResourceOwnerId: (
    request: AuthenticatedRequest,
    context?: any
  ) => Promise<string | null>
) {
  return (handler: AuthHandler): AuthHandler => {
    return async (request, context) => {
      // ADMINs see everything
      if (request.auth.role === "ADMIN") {
        return handler(request, context);
      }

      const ownerId = await getResourceOwnerId(request, context);

      if (!ownerId) {
        return NextResponse.json(
          apiError("Resource not found", "NOT_FOUND"),
          { status: 404 }
        );
      }

      // STAFF can access by staffId, CLIENTs by clientId or userId
      const isOwner =
        ownerId === request.auth.userId ||
        ownerId === request.auth.staffId ||
        ownerId === request.auth.clientId;

      if (!isOwner) {
        return NextResponse.json(
          apiError("You do not have access to this resource", "FORBIDDEN"),
          { status: 403 }
        );
      }

      return handler(request, context);
    };
  };
}

// ============= UTILITY =============

/** Extract client IP for audit / rate-limiting. */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
