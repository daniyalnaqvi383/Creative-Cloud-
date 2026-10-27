import { SignJWT, jwtVerify } from "jose";
import { getAdminSessionSecret } from "./env";

export const ADMIN_COOKIE_NAME = "cc_admin_session";

function getSecretKey(): Uint8Array {
  const secret = getAdminSessionSecret();
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
