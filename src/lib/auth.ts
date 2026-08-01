import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "netwise_admin_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("Thiếu biến môi trường AUTH_SECRET");
  return new TextEncoder().encode(value);
}

export async function createSessionToken(adminId: string, email: string) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}
