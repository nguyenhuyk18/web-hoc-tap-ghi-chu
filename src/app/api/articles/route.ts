import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/articles";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { Specialty } from "@/models/Specialty";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  await connectMongoDB();
  const session = await getSession();
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(20, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 9));
  const type = request.nextUrl.searchParams.get("type")?.trim();
  const filter = { ...(session ? {} : { published: true }), ...(type ? { type } : {}) };
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
    const body = await request.json(); const slug = makeSlug(body.slug || body.title || "");
    if (!body.title?.trim() || !body.summary?.trim() || !body.content?.trim() || !slug) throw new Error("Vui lòng nhập đủ nội dung bắt buộc");
    if (await Article.exists({ slug })) throw new Error("Đường dẫn bài viết đã tồn tại");
    if (!body.type || !(await Specialty.exists({ name: body.type }))) throw new Error("Chuyên ngành không hợp lệ");
    const article = await Article.create({ ...body, type: body.type, title: body.title.trim(), summary: body.summary.trim(), slug, published: Boolean(body.published) });
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo bài viết" }, { status: 400 });
  }
}
