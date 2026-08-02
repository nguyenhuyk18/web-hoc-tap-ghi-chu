import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/articles";
import { articleFromFirestore, articleToJson } from "@/lib/firestore-data";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    const { id } = await params; const body = await request.json(); const slug = makeSlug(body.slug || body.title || "");
    if (!body.title?.trim() || !body.summary?.trim() || !body.content?.trim() || !slug) throw new Error("Vui lòng nhập đủ nội dung bắt buộc");
    const firestore = getAdminFirestore(); const reference = firestore.collection("articles").doc(id); const existing = await reference.get();
    if (!existing.exists) return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    const duplicated = await firestore.collection("articles").where("slug", "==", slug).get();
    if (duplicated.docs.some((document) => document.id !== id)) throw new Error("Đường dẫn bài viết đã tồn tại");
    await reference.update({ title: body.title.trim(), slug, summary: body.summary.trim(), content: body.content, coverImage: body.coverImage || "", category: body.category || "Cơ bản", level: body.level || "Nhập môn", published: Boolean(body.published), updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ article: articleToJson(articleFromFirestore(await reference.get())) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể cập nhật" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const { id } = await params; const reference = getAdminFirestore().collection("articles").doc(id);
  if (!(await reference.get()).exists) return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
  await reference.delete(); return NextResponse.json({ success: true });
}
