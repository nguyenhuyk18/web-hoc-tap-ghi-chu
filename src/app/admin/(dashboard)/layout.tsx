import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession(); if (!session) redirect("/admin/login");
  return <main className="adminPage"><header className="adminHeader"><Link className="brand" href="/">NET<span>WISE</span></Link><nav><Link href="/admin/articles">Bài viết</Link><Link href="/admin/terms">Thuật ngữ</Link><Link href="/" target="_blank">Xem trang web ↗</Link><form action="/api/auth/logout" method="post"><button>Đăng xuất</button></form></nav></header>{children}</main>;
}
