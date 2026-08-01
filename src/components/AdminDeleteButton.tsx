"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminDeleteButton({ id }: { id: string }) {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  async function remove() {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;
    setLoading(true); const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (!response.ok) alert("Không thể xóa bài viết"); else router.refresh(); setLoading(false);
  }
  return <button className="dangerButton" onClick={remove} disabled={loading}>Xóa</button>;
}
