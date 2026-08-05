"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function CourseNoteDeleteButton({ id }: { id: string }) { const router=useRouter(); const [loading,setLoading]=useState(false); async function remove(){ if(!confirm("Bạn chắc chắn muốn xóa note này?")) return; setLoading(true); const response=await fetch(`/api/course-notes/${id}`,{method:"DELETE"}); if(!response.ok) alert("Không thể xóa note"); else router.refresh(); setLoading(false); } return <button className="dangerButton" disabled={loading} onClick={remove}>Xóa</button>; }
