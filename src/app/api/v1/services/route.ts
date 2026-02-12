import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    const services = await db.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    return NextResponse.json(apiSuccess(services));
  } catch (error) {
    console.error("GET /api/v1/services error:", error);
    return NextResponse.json(
      apiError("Error fetching services", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/services (Admin only)
 * Create a new service
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add auth check for ADMIN role

    const body = await request.json();
    const { name, description, category, durationMin, price, active } = body;

    if (!name || !price || !durationMin || !category) {
      return NextResponse.json(
        apiError("Missing required fields", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: {
        name,
        description,
        category,
        durationMin,
        price,
        active: active ?? true,
      },
    });

    return NextResponse.json(apiSuccess(service), { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/services error:", error);
    return NextResponse.json(
      apiError("Error creating service", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
