import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const seedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const seedPassword = process.env.ADMIN_PASSWORD;
  if (!seedEmail || !seedPassword) return NextResponse.json({ error: "Admin chưa được cấu hình" }, { status: 500 });
  await connectMongoDB();
  let admin = await Admin.findOne({ email: seedEmail });
  if (!admin) admin = await Admin.create({ email: seedEmail, passwordHash: await bcrypt.hash(seedPassword, 12) });
  const valid = email?.toLowerCase() === admin.email && await bcrypt.compare(password || "", admin.passwordHash);
  if (!valid) return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(admin.id, admin.email), {
    httpOnly: true, sameSite: "lax", secure: process.env.AUTH_SECURE_COOKIE === "true", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
