import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api/response";
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware";

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const includeInactive =
      request.auth.role === "ADMIN" &&
      request.nextUrl.searchParams.get("all") === "true";

    const staff = await db.staff.findMany({
      where: {
        deletedAt: null,
        user: {
          active: includeInactive ? undefined : true,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true,
          },
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                category: true,
                durationMin: true,
                price: true,
                active: true,
              },
            },
          },
        },
        schedules: {
          where: { isAvailable: true },
          orderBy: { dayOfWeek: "asc" },
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(apiSuccess(staff));
  } catch (error) {
    console.error("GET /api/v1/staff error:", error);
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
});
