import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { InterviewQuestion } from "@/models/InterviewQuestion";
import { Specialty } from "@/models/Specialty";
import { isRichTextEmpty } from "@/lib/rich-text";

export async function GET(request: NextRequest) {
  await connectMongoDB(); const type = request.nextUrl.searchParams.get("type")?.trim(); const filter = type ? { type } : {};
  return NextResponse.json({ questions: await InterviewQuestion.find(filter).sort({ createdAt: -1 }).lean() });
}
export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try { await connectMongoDB(); const { question, answer, type } = await request.json(); if (!question?.trim() || isRichTextEmpty(answer)) throw new Error("Vui lòng nhập câu hỏi và câu trả lời"); if (!type || !(await Specialty.exists({ name: type }))) throw new Error("Chuyên ngành không hợp lệ"); const item = await InterviewQuestion.create({ question, answer, type }); return NextResponse.json({ item }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo câu hỏi" }, { status: 400 }); }
}
