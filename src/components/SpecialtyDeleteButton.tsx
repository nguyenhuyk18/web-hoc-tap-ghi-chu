"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SpecialtyDeleteButton({ id }: { id: string }) {
  const router = useRouter(); const [deleting, setDeleting] = useState(false);
  async function remove() {
    if (!window.confirm("Bạn chắc chắn muốn xóa chuyên ngành này?")) return;
    setDeleting(true); const response = await fetch(`/api/specialties/${id}`, { method: "DELETE" }); const result = await response.json();
    if (!response.ok) { alert(result.error || "Không thể xóa chuyên ngành"); setDeleting(false); return; }
    router.refresh();
  }
  return <button className="dangerButton" disabled={deleting} onClick={remove}>Xóa</button>;
}
