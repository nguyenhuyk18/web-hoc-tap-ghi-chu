import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Term } from "@/models/Term";
import { Specialty } from "@/models/Specialty";
import { isRichTextEmpty } from "@/lib/rich-text";

export async function GET(request: NextRequest) {
  await connectMongoDB(); const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 20));
  const search = request.nextUrl.searchParams.get("search")?.trim();
  const type = request.nextUrl.searchParams.get("type")?.trim();
  const filter = { ...(search ? { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {}), ...(type ? { type } : {}) };
  const [terms, total] = await Promise.all([Term.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(), Term.countDocuments(filter)]);
  return NextResponse.json({ terms, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    await connectMongoDB(); const { name, description, type } = await request.json();
    if (!name?.trim() || isRichTextEmpty(description)) throw new Error("Vui lòng nhập tên thuật ngữ và diễn giải");
    if (!type || !(await Specialty.exists({ name: type }))) throw new Error("Chuyên ngành không hợp lệ");
    const term = await Term.create({ name, description, type }); return NextResponse.json({ term }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo thuật ngữ";
    return NextResponse.json({ error: message.includes("duplicate key") ? "Tên thuật ngữ đã tồn tại" : message }, { status: 400 });
  }
}
