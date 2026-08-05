"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function SubjectDeleteButton({ id }: { id: string }) { const router=useRouter(); const [loading,setLoading]=useState(false); async function remove(){ if(!confirm("Xóa môn học và toàn bộ note thuộc môn này?")) return; setLoading(true); const response=await fetch(`/api/subjects/${id}`,{method:"DELETE"}); const result=await response.json(); if(!response.ok) alert(result.error || "Không thể xóa"); else router.refresh(); setLoading(false); } return <button className="dangerButton" disabled={loading} onClick={remove}>Xóa</button>; }
