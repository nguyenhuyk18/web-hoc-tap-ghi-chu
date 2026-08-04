"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function InterviewQuestionDeleteButton({ id }: { id: string }) {
  const router = useRouter(); const [deleting, setDeleting] = useState(false);
  async function remove() {
    if (!window.confirm("Bạn chắc chắn muốn xóa câu hỏi này?")) return;
    setDeleting(true); const response = await fetch(`/api/interview-questions/${id}`, { method: "DELETE" });
    if (!response.ok) { alert("Không thể xóa câu hỏi"); setDeleting(false); return; } router.refresh();
  }
  return <button className="dangerButton" disabled={deleting} onClick={remove}>Xóa</button>;
}
