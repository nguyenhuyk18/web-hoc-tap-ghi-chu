import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Specialty } from "@/models/Specialty";

export async function GET() {
  await connectMongoDB(); const specialties = await Specialty.find().sort({ name: 1 }).lean();
  return NextResponse.json({ specialties });
}

export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    await connectMongoDB(); const { name, description } = await request.json();
    if (!name?.trim()) throw new Error("Vui lòng nhập tên chuyên ngành");
    if (await Specialty.exists({ name: name.trim() })) throw new Error("Tên chuyên ngành đã tồn tại");
    const specialty = await Specialty.create({ name: name.trim(), description: description?.trim() || "" });
    return NextResponse.json({ specialty }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo chuyên ngành" }, { status: 400 });
  }
}
