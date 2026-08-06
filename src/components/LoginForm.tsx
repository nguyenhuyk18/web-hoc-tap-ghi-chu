"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
      const result = await response.json().catch(() => ({ error: "Máy chủ trả về phản hồi không hợp lệ" }));
      if (!response.ok) return setError(result.error || "Không thể đăng nhập");
      router.replace("/admin/articles"); router.refresh();
    } catch { setError("Không thể kết nối tới máy chủ"); }
    finally { setLoading(false); }
  }
  return <form className="adminForm loginForm" onSubmit={submit}>
    <label>Email<input name="email" type="email" defaultValue="admin@netwise.vn" required /></label>
    <label>Mật khẩu<input name="password" type="password" required /></label>
    {error && <p className="formError">{error}</p>}
    <button className="primary" disabled={loading}>Đăng nhập</button>
  </form>;
}
