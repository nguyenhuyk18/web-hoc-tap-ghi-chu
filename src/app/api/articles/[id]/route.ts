import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/articles";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    await connectMongoDB();
    const { id } = await params;
    const body = await request.json();
    const article = await Article.findByIdAndUpdate(id, { ...body, slug: makeSlug(body.slug || body.title) }, { new: true, runValidators: true });
    if (!article) return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể cập nhật" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  await connectMongoDB();
  const { id } = await params;
  const article = await Article.findByIdAndDelete(id);
  if (!article) return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
  return NextResponse.json({ success: true });
}
