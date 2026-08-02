import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/articles";
import { articleFromFirestore, articleToJson, sortArticlesNewestFirst } from "@/lib/firestore-data";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(20, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 9));
  const snapshot = await getAdminFirestore().collection("articles").get();
  const available = sortArticlesNewestFirst(snapshot.docs.map(articleFromFirestore).filter((article) => session || article.published));
  const articles = available.slice((page - 1) * limit, page * limit).map(articleToJson);
  return NextResponse.json({ articles, pagination: { page, limit, total: available.length, pages: Math.ceil(available.length / limit) } });
}

export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    const body = await request.json();
    const slug = makeSlug(body.slug || body.title || "");
    if (!body.title?.trim() || !body.summary?.trim() || !body.content?.trim() || !slug) throw new Error("Vui lòng nhập đủ nội dung bắt buộc");
    const firestore = getAdminFirestore();
    const duplicated = await firestore.collection("articles").where("slug", "==", slug).limit(1).get();
    if (!duplicated.empty) throw new Error("Đường dẫn bài viết đã tồn tại");
    const reference = firestore.collection("articles").doc();
    await reference.set({
      title: body.title.trim(), slug, summary: body.summary.trim(), content: body.content,
      coverImage: body.coverImage || "", category: body.category || "Cơ bản", level: body.level || "Nhập môn",
      published: Boolean(body.published), createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
    const created = await reference.get();
    return NextResponse.json({ article: articleToJson(articleFromFirestore(created)) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo bài viết" }, { status: 400 });
  }
}
