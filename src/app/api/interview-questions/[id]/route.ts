import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { InterviewQuestion } from "@/models/InterviewQuestion";
import { Specialty } from "@/models/Specialty";
type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try { await connectMongoDB(); const { id } = await params; const { question, answer, type } = await request.json(); if (!question?.trim() || !answer?.trim()) throw new Error("Vui lòng nhập đủ thông tin"); if (!type || !(await Specialty.exists({ name: type }))) throw new Error("Chuyên ngành không hợp lệ"); const item = await InterviewQuestion.findByIdAndUpdate(id, { question, answer, type }, { new: true, runValidators: true }); if (!item) return NextResponse.json({ error: "Không tìm thấy câu hỏi" }, { status: 404 }); return NextResponse.json({ item }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể cập nhật câu hỏi" }, { status: 400 }); }
}
export async function DELETE(_: NextRequest, { params }: Context) { if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }); await connectMongoDB(); const { id } = await params; const item = await InterviewQuestion.findByIdAndDelete(id); if (!item) return NextResponse.json({ error: "Không tìm thấy câu hỏi" }, { status: 404 }); return NextResponse.json({ success: true }); }
