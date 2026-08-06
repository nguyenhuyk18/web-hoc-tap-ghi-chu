import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    await connectMongoDB();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Vui lòng nhập email và mật khẩu" }, { status: 400 });
    }

    // ADMIN_EMAIL/ADMIN_PASSWORD are only used to seed the very first account.
    // Every login is verified against the bcrypt passwordHash stored in MongoDB.
    if (!(await Admin.exists({}))) {
      const seedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const seedPassword = process.env.ADMIN_PASSWORD;
      if (!seedEmail || !seedPassword) {
        return NextResponse.json({ error: "Chưa có tài khoản admin trong database" }, { status: 500 });
      }
      await Admin.create({ email: seedEmail, passwordHash: await bcrypt.hash(seedPassword, 12) });
    }

    const admin = await Admin.findOne({ email: normalizedEmail }).select("+passwordHash");
    const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (!valid) return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    if (!process.env.AUTH_SECRET) return NextResponse.json({ error: "Máy chủ thiếu AUTH_SECRET" }, { status: 500 });

    const response = NextResponse.json({ success: true });
    const forwardedProtocol = request.headers.get("x-forwarded-proto");
    response.cookies.set(SESSION_COOKIE, await createSessionToken(admin.id, admin.email), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.AUTH_SECURE_COOKIE === "true" || forwardedProtocol === "https" || request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    const databaseError = error instanceof Error && /ECONNREFUSED|Server selection|querySrv|Mongo/i.test(error.message);
    return NextResponse.json({ error: databaseError ? "Không thể kết nối cơ sở dữ liệu" : "Máy chủ không thể xử lý đăng nhập" }, { status: 500 });
  }
}
