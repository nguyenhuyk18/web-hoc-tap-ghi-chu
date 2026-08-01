"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type TermValue = { _id?: string; name?: string; description?: string };

export function TermForm({ term = {} }: { term?: TermValue }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(term._id ? `/api/terms/${term._id}` : "/api/terms", { method: term._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) { setSaving(false); return setError(result.error); }
    router.replace("/admin/terms");
  }
  return <form className="termForm" onSubmit={submit}>
    <label>Tên thuật ngữ *<input name="name" defaultValue={term.name} required placeholder="Ví dụ: TCP/IP" /></label>
    <label>Diễn giải *<textarea name="description" defaultValue={term.description} required rows={8} placeholder="Giải thích ngắn gọn, dễ hiểu về thuật ngữ..." /></label>
    {error && <p className="formError">{error}</p>}
    <div className="formActions"><button type="button" onClick={() => router.back()}>Hủy</button><button className="primary" disabled={saving}>{term._id ? "Lưu thay đổi" : "Thêm thuật ngữ"}</button></div>
  </form>;
}
