import { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "./auth";

export async function isAuthenticatedAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
