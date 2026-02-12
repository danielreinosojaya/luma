import { NextRequest, NextResponse } from "next/server";
import { signInSchema } from "@/lib/validators/schemas";
import { getUserByEmail, verifyPassword } from "@/lib/auth/helpers";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = signInSchema.safeParse(body);
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

    // Get user
    const user = await getUserByEmail(data.email);
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        apiError("Invalid email or password", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(data.password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        apiError("Invalid email or password", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    // TODO: Generate JWT token

    return NextResponse.json(
      apiSuccess({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        // token: "...",
      })
    );
  } catch (error) {
    console.error("POST /api/v1/auth/signin error:", error);
    return NextResponse.json(
      apiError("Error signing in", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
