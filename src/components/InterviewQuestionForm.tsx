"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type QuestionValue = { _id?: string; question?: string; answer?: string; type?: string };

export function InterviewQuestionForm({ item = {}, specialties }: { item?: QuestionValue; specialties: string[] }) {
  const router = useRouter(); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(item._id ? `/api/interview-questions/${item._id}` : "/api/interview-questions", { method: item._id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json(); if (!response.ok) { setSaving(false); return setError(result.error); }
    router.replace("/admin/interview-questions"); router.refresh();
  }
  return <form className="termForm interviewQuestionForm" onSubmit={submit}>
    <label>Chuyên ngành *<select name="type" defaultValue={item.type || specialties[0]} required>{specialties.map((name) => <option key={name}>{name}</option>)}</select></label>
    <label>Câu hỏi phỏng vấn *<textarea name="question" defaultValue={item.question} required rows={4} placeholder="Ví dụ: Hãy giải thích sự khác nhau giữa TCP và UDP?" /></label>
    <label>Câu trả lời gợi ý *<textarea name="answer" defaultValue={item.answer} required rows={10} placeholder="Nhập câu trả lời đầy đủ, dễ ôn tập..." /></label>
    {error && <p className="formError">{error}</p>}
    <div className="formActions"><button type="button" onClick={() => router.back()}>Hủy</button><button className="primary" disabled={saving}>{item._id ? "Lưu thay đổi" : "Thêm câu hỏi"}</button></div>
  </form>;
}
