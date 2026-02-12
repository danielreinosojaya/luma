import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";
import { createServiceSchema } from "@/lib/validators/schemas";
import {
  withAuth,
  requireRole,
  getClientIp,
  type AuthenticatedRequest,
} from "@/lib/auth/middleware";

// GET /api/v1/services — Public catalog (still requires auth)
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const includeInactive = request.auth.role === "ADMIN" && searchParams.get("all") === "true";

    const where: any = {};
    if (!includeInactive) where.active = true;
    if (category) where.category = category;

    const services = await db.service.findMany({
      where,
      orderBy: { category: "asc" },
    });

    return NextResponse.json(apiSuccess(services));
  } catch (error) {
    console.error("GET /api/v1/services error:", error);
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
});

// POST /api/v1/services — ADMIN only
export const POST = withAuth(
  requireRole("ADMIN")(async (request: AuthenticatedRequest) => {
    try {
      const ip = getClientIp(request);
      const body = await request.json();

      // Zod validation (replaces manual field check)
      const parsed = createServiceSchema.safeParse(body);
      if (!parsed.success) {
        const errors = Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v || []])
        );
        return NextResponse.json(validationError(errors), { status: 400 });
      }

      const data = parsed.data;

      const service = await db.$transaction(async (tx: any) => {
        const svc = await tx.service.create({
          data: {
            name: data.name.trim(),
            description: data.description?.trim(),
            category: data.category,
            durationMin: data.durationMin,
            price: data.price,
            active: data.active,
          },
        });

        await tx.auditLog.create({
          data: {
            userId: request.auth.userId,
            action: "CREATE",
            entity: "Service",
            entityId: svc.id,
            changes: JSON.stringify(data),
            ipAddress: ip,
          },
        });

        return svc;
      });

      return NextResponse.json(apiSuccess(service), { status: 201 });
    } catch (error) {
      console.error("POST /api/v1/services error:", error);
      return NextResponse.json(
        apiError("An unexpected error occurred", "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
  })
);
