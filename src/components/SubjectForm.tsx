"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SubjectValue = { _id?: string; name?: string; code?: string; slug?: string; description?: string; color?: string };
export function SubjectForm({ subject = {} }: { subject?: SubjectValue }) {
  const router = useRouter(); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const body = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch(subject._id ? `/api/subjects/${subject._id}` : "/api/subjects", { method: subject._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Không thể lưu môn học");
      router.replace("/admin/subjects"); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể lưu môn học"); setSaving(false); }
  }
  return <form className="termForm subjectForm" onSubmit={submit}>
    <div className="editorFields"><label>Tên môn học *<input name="name" required defaultValue={subject.name} placeholder="Ví dụ: Cấu trúc dữ liệu và giải thuật" /></label><label>Mã môn<input name="code" defaultValue={subject.code} placeholder="Ví dụ: IT003" /></label><label>Đường dẫn<input name="slug" defaultValue={subject.slug} placeholder="Để trống sẽ tự tạo" /></label><label>Màu nhận diện<input name="color" type="color" defaultValue={subject.color || "#2563eb"} /></label><label className="full">Mô tả<textarea name="description" rows={6} defaultValue={subject.description} placeholder="Môn học này cung cấp kiến thức gì?" /></label></div>
    {error && <p className="formError">{error}</p>}<div className="formActions"><button type="button" onClick={() => router.back()}>Hủy</button><button className="primary" disabled={saving}>{saving ? "Đang lưu..." : subject._id ? "Lưu thay đổi" : "Thêm môn học"}</button></div>
  </form>;
}
