"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TermDeleteButton({ id }: { id: string }) {
  const router = useRouter(); const [deleting, setDeleting] = useState(false);
  async function remove() {
    if (!window.confirm("Bạn chắc chắn muốn xóa thuật ngữ này?")) return;
    setDeleting(true); const response = await fetch(`/api/terms/${id}`, { method: "DELETE" });
    if (!response.ok) { alert("Không thể xóa thuật ngữ"); setDeleting(false); return; }
    router.refresh();
  }
  return <button className="dangerButton" disabled={deleting} onClick={remove}>Xóa</button>;
}
