import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Term } from "@/models/Term";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    await connectMongoDB();
    const { id } = await params;
    const { name, description } = await request.json();
    if (!name?.trim() || !description?.trim()) throw new Error("Vui lòng nhập đủ thông tin");
    const term = await Term.findByIdAndUpdate(id, { name, description }, { new: true, runValidators: true });
    if (!term) return NextResponse.json({ error: "Không tìm thấy thuật ngữ" }, { status: 404 });
    return NextResponse.json({ term });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật";
    return NextResponse.json({ error: message.includes("duplicate key") ? "Tên thuật ngữ đã tồn tại" : message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  await connectMongoDB();
  const { id } = await params;
  const term = await Term.findByIdAndDelete(id);
  if (!term) return NextResponse.json({ error: "Không tìm thấy thuật ngữ" }, { status: 404 });
  return NextResponse.json({ success: true });
}
