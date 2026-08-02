import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getSession } from "@/lib/auth";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { termFromFirestore } from "@/lib/firestore-terms";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try {
    const { id } = await params;
    const { name, description } = await request.json();
    if (!name?.trim() || !description?.trim()) throw new Error("Vui lòng nhập đủ thông tin");
    const firestore = getAdminFirestore(); const reference = firestore.collection("terms").doc(id);
    if (!(await reference.get()).exists) return NextResponse.json({ error: "Không tìm thấy thuật ngữ" }, { status: 404 });
    const duplicate = await firestore.collection("terms").where("name", "==", name.trim()).get();
    if (duplicate.docs.some((document) => document.id !== id)) throw new Error("Tên thuật ngữ đã tồn tại");
    await reference.update({ name: name.trim(), description: description.trim(), updatedAt: FieldValue.serverTimestamp() });
    const term = termFromFirestore(await reference.get());
    return NextResponse.json({ term });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const { id } = await params;
  const reference = getAdminFirestore().collection("terms").doc(id);
  if (!(await reference.get()).exists) return NextResponse.json({ error: "Không tìm thấy thuật ngữ" }, { status: 404 });
  await reference.delete();
  return NextResponse.json({ success: true });
}
