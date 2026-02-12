import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    const combos = await db.combo.findMany({
      where: {
        active: true,
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json(apiSuccess(combos));
  } catch (error) {
    console.error("GET /api/v1/combos error:", error);
    return NextResponse.json(
      apiError("Error fetching combos", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/combos (Admin only)
 * Create a new combo
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add auth check for ADMIN role

    const body = await request.json();
    const { name, description, price, discountPct, serviceIds, active } = body;

    if (!name || !price || !serviceIds || serviceIds.length === 0) {
      return NextResponse.json(
        apiError("Missing required fields", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const combo = await db.combo.create({
      data: {
        name,
        description,
        price,
        discountPct: discountPct ?? 0,
        active: active ?? true,
        services: {
          create: serviceIds.map((serviceId: string) => ({
            serviceId,
          })),
        },
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    return NextResponse.json(apiSuccess(combo), { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/combos error:", error);
    return NextResponse.json(
      apiError("Error creating combo", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
