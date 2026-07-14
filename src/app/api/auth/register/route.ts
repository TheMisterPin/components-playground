import { NextResponse } from "next/server";
import { registerAction } from "@/features/auth/actions/auth-actions";
import { AuthError } from "@/features/auth/types/auth-types";

function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    const status =
      error.code === "CONFLICT"
        ? 409
        : error.code === "INVALID_CREDENTIALS"
          ? 401
          : 400;

    return NextResponse.json({ error: error.message, code: error.code }, { status });
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerAction(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
