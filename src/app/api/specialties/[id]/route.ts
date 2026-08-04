import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { Specialty } from "@/models/Specialty";
import { Term } from "@/models/Term";
import { InterviewQuestion } from "@/models/InterviewQuestion";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    await connectMongoDB(); const { id } = await params; const { name, description } = await request.json();
    if (!name?.trim()) throw new Error("Vui lòng nhập tên chuyên ngành");
    const specialty = await Specialty.findById(id); if (!specialty) return NextResponse.json({ error: "Không tìm thấy chuyên ngành" }, { status: 404 });
    if (await Specialty.exists({ name: name.trim(), _id: { $ne: id } })) throw new Error("Tên chuyên ngành đã tồn tại");
    const previousName = specialty.name; specialty.name = name.trim(); specialty.description = description?.trim() || ""; await specialty.save();
    if (previousName !== specialty.name) await Promise.all([Article.updateMany({ type: previousName }, { $set: { type: specialty.name } }), Term.updateMany({ type: previousName }, { $set: { type: specialty.name } }), InterviewQuestion.updateMany({ type: previousName }, { $set: { type: specialty.name } })]);
    return NextResponse.json({ specialty });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể cập nhật chuyên ngành" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  await connectMongoDB(); const { id } = await params; const specialty = await Specialty.findById(id);
  if (!specialty) return NextResponse.json({ error: "Không tìm thấy chuyên ngành" }, { status: 404 });
  const [articles, terms, questions] = await Promise.all([Article.countDocuments({ type: specialty.name }), Term.countDocuments({ type: specialty.name }), InterviewQuestion.countDocuments({ type: specialty.name })]);
  if (articles > 0 || terms > 0 || questions > 0) return NextResponse.json({ error: `Không thể xóa vì đang có ${articles} bài viết, ${terms} thuật ngữ và ${questions} câu hỏi thuộc chuyên ngành này` }, { status: 409 });
  await specialty.deleteOne(); return NextResponse.json({ success: true });
}
