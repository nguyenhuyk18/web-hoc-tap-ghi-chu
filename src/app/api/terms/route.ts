import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getSession } from "@/lib/auth";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { sortTerms, termFromFirestore } from "@/lib/firestore-terms";

export async function GET(request: NextRequest) {
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 20));
  const search = request.nextUrl.searchParams.get("search")?.trim();
  const snapshot = await getAdminFirestore().collection("terms").get();
  const normalizedSearch = search?.toLocaleLowerCase("vi");
  const allTerms = sortTerms(snapshot.docs.map(termFromFirestore)).filter((term) => !normalizedSearch || term.name.toLocaleLowerCase("vi").includes(normalizedSearch));
  const total = allTerms.length;
  const terms = allTerms.slice((page - 1) * limit, page * limit);
  return NextResponse.json({ terms, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    const { name, description } = await request.json();
    if (!name?.trim() || !description?.trim()) throw new Error("Vui lòng nhập tên thuật ngữ và diễn giải");
    const firestore = getAdminFirestore();
    const duplicate = await firestore.collection("terms").where("name", "==", name.trim()).limit(1).get();
    if (!duplicate.empty) throw new Error("Tên thuật ngữ đã tồn tại");
    const reference = firestore.collection("terms").doc();
    await reference.set({ name: name.trim(), description: description.trim(), createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    const term = termFromFirestore(await reference.get());
    return NextResponse.json({ term }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo thuật ngữ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
