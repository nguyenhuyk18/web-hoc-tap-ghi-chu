import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminStorage } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Chưa chọn ảnh" }, { status: 400 });
  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Chỉ nhận ảnh tối đa 5MB" }, { status: 400 });
  const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "webp";
  const name = `articles/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const token = crypto.randomUUID();
  try {
    const bucket = getAdminStorage().bucket();
    await bucket.file(name).save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      resumable: false,
      metadata: { cacheControl: "public,max-age=31536000,immutable", metadata: { firebaseStorageDownloadTokens: token } },
    });
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(name)}?alt=media&token=${token}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Firebase Storage upload failed:", error);
    return NextResponse.json({ error: "Firebase Storage chưa được khởi tạo hoặc cấu hình bucket chưa đúng" }, { status: 503 });
  }
}
