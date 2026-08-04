"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SpecialtyValue = { _id?: string; name?: string; description?: string };

export function SpecialtyForm({ specialty = {} }: { specialty?: SpecialtyValue }) {
  const router = useRouter(); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(specialty._id ? `/api/specialties/${specialty._id}` : "/api/specialties", { method: specialty._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) { setSaving(false); return setError(result.error); }
    router.replace("/admin/specialties"); router.refresh();
  }
  return <form className="termForm" onSubmit={submit}>
    <label>Tên chuyên ngành *<input name="name" defaultValue={specialty.name} required placeholder="Ví dụ: DevOps" /></label>
    <label>Mô tả<textarea name="description" defaultValue={specialty.description} rows={6} placeholder="Mô tả ngắn về chuyên ngành..." /></label>
    {error && <p className="formError">{error}</p>}
    <div className="formActions"><button type="button" onClick={() => router.back()}>Hủy</button><button className="primary" disabled={saving}>{specialty._id ? "Lưu thay đổi" : "Thêm chuyên ngành"}</button></div>
  </form>;
}
