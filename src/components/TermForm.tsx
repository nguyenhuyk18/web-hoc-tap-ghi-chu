"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CompactRichEditor } from "@/components/CompactRichEditor";

type TermValue = { _id?: string; name?: string; description?: string; type?: string };

export function TermForm({ term = {}, specialties }: { term?: TermValue; specialties: string[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState(term.description || "");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const body = { ...Object.fromEntries(new FormData(event.currentTarget)), description };
      const response = await fetch(term._id ? `/api/terms/${term._id}` : "/api/terms", { method: term._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => ({ error: "Máy chủ trả về dữ liệu không hợp lệ" }));
      if (!response.ok) throw new Error(result.error || "Không thể lưu thuật ngữ");
      router.replace("/admin/terms"); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể kết nối máy chủ"); }
    finally { setSaving(false); }
  }
  return <form className="termForm" onSubmit={submit}>
    <label>Tên thuật ngữ *<input name="name" defaultValue={term.name} required placeholder="Ví dụ: TCP/IP" /></label>
    <label>Chuyên ngành *<select name="type" defaultValue={term.type || specialties[0]} required>{specialties.map((name) => <option key={name}>{name}</option>)}</select></label>
    <label>Diễn giải *</label><CompactRichEditor value={term.description} onChange={setDescription} placeholder="Giải thích đầy đủ, dễ hiểu về thuật ngữ..." />
    {error && <p className="formError">{error}</p>}
    <div className="formActions"><button type="button" onClick={() => router.back()}>Hủy</button><button className="primary" disabled={saving}>{saving ? "Đang lưu..." : term._id ? "Lưu thay đổi" : "Thêm thuật ngữ"}</button></div>
  </form>;
}
