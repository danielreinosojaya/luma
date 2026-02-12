import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";
import { createComboSchema } from "@/lib/validators/schemas";
import {
  withAuth,
  requireRole,
  getClientIp,
  type AuthenticatedRequest,
} from "@/lib/auth/middleware";

// GET /api/v1/combos — All authenticated users
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const includeInactive =
      request.auth.role === "ADMIN" &&
      request.nextUrl.searchParams.get("all") === "true";

    const where: any = {};
    if (!includeInactive) where.active = true;

    const combos = await db.combo.findMany({
      where,
      include: {
        services: { include: { service: true } },
      },
    });

    return NextResponse.json(apiSuccess(combos));
  } catch (error) {
    console.error("GET /api/v1/combos error:", error);
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
});

// POST /api/v1/combos — ADMIN only
export const POST = withAuth(
  requireRole("ADMIN")(async (request: AuthenticatedRequest) => {
    try {
      const ip = getClientIp(request);
      const body = await request.json();

      const parsed = createComboSchema.safeParse(body);
      if (!parsed.success) {
        const errors = Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v || []])
        );
        return NextResponse.json(validationError(errors), { status: 400 });
      }

      const data = parsed.data;

      // Verify all services exist
      const services = await db.service.findMany({
        where: { id: { in: data.serviceIds }, active: true },
      });

      if (services.length !== data.serviceIds.length) {
        return NextResponse.json(
          apiError("One or more services not found or inactive", "NOT_FOUND"),
          { status: 404 }
        );
      }

      const combo = await db.$transaction(async (tx: any) => {
        const c = await tx.combo.create({
          data: {
            name: data.name.trim(),
            description: data.description?.trim(),
            price: data.price,
            discountPct: data.discountPct ?? 0,
            active: data.active ?? true,
            services: {
              create: data.serviceIds.map((serviceId: string) => ({
                serviceId,
              })),
            },
          },
          include: {
            services: { include: { service: true } },
          },
        });

        await tx.auditLog.create({
          data: {
            userId: request.auth.userId,
            action: "CREATE",
            entity: "Combo",
            entityId: c.id,
            changes: JSON.stringify(data),
            ipAddress: ip,
          },
        });

        return c;
      });

      return NextResponse.json(apiSuccess(combo), { status: 201 });
    } catch (error) {
      console.error("POST /api/v1/combos error:", error);
      return NextResponse.json(
        apiError("An unexpected error occurred", "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
  })
);
