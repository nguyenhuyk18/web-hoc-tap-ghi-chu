import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const seedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const seedPassword = process.env.ADMIN_PASSWORD;
  if (!seedEmail || !seedPassword) return NextResponse.json({ error: "Admin chưa được cấu hình" }, { status: 500 });
  const firestore = getAdminFirestore();
  const found = await firestore.collection("admins").where("email", "==", seedEmail).limit(1).get();
  let adminId: string; let adminEmail: string; let passwordHash: string;
  if (found.empty) {
    const reference = firestore.collection("admins").doc();
    passwordHash = await bcrypt.hash(seedPassword, 12); adminId = reference.id; adminEmail = seedEmail;
    await reference.set({ email: adminEmail, passwordHash, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  } else {
    const document = found.docs[0]; const data = document.data();
    adminId = document.id; adminEmail = String(data.email); passwordHash = String(data.passwordHash);
  }
  const valid = email?.toLowerCase() === adminEmail && await bcrypt.compare(password || "", passwordHash);
  if (!valid) return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(adminId, adminEmail), {
    httpOnly: true, sameSite: "lax", secure: process.env.AUTH_SECURE_COOKIE === "true", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
