import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/articles";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";

export async function GET(request: NextRequest) {
  await connectMongoDB();
  const session = await getSession();
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(20, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 9));
  const filter = session ? {} : { published: true };
  const [articles, total] = await Promise.all([
    Article.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);
  return NextResponse.json({ articles, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    await connectMongoDB();
    const body = await request.json();
    const slug = makeSlug(body.slug || body.title);
    if (!body.title || !body.summary || !body.content || !slug) throw new Error("Vui lòng nhập đủ nội dung bắt buộc");
    const article = await Article.create({ ...body, slug });
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo bài viết";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
