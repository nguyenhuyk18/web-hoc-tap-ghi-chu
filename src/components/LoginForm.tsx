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
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
    const result = await response.json();
    if (!response.ok) { setLoading(false); return setError(result.error); }
    router.replace("/admin/articles");
  }
  return <form className="adminForm loginForm" onSubmit={submit}>
    <label>Email<input name="email" type="email" defaultValue="admin@netwise.vn" required /></label>
    <label>Mật khẩu<input name="password" type="password" required /></label>
    {error && <p className="formError">{error}</p>}
    <button className="primary" disabled={loading}>Đăng nhập</button>
  </form>;
}
