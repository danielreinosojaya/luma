import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validators/schemas";
import { createUser, getUserByEmail } from "@/lib/auth/helpers";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v || [],
        ])
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

    // Create user (client)
    const user = await createUser(
      data.email,
      data.password,
      data.name,
      "CLIENT"
    );

    // Create client profile
    // Note: In a real app, this would be handled in a transaction
    // For now, we'll let the middleware/controller handle it

    return NextResponse.json(
      apiSuccess({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/v1/auth/signup error:", error);
    return NextResponse.json(
      apiError("Error creating account", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
