import { NextResponse } from "next/server";
import { logoutAction } from "@/features/auth/actions/auth-actions";

export async function POST() {
  await logoutAction();

  return NextResponse.json({ success: true });
}
