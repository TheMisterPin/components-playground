import { NextRequest } from "next/server";
import { updateSession } from "./lib/auth/utils";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}