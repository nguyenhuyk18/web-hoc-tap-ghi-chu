"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const adminLinks = [
  { href: "/admin/articles", label: "Bài viết", icon: "▤" },
  { href: "/admin/specialties", label: "Chuyên ngành", icon: "⌘" },
  { href: "/admin/terms", label: "Thuật ngữ", icon: "Aa" },
  { href: "/admin/interview-questions", label: "Phỏng vấn", icon: "?" },
  { href: "/admin/subjects", label: "Môn học", icon: "◇" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return <header className={`adminTopbar${open ? " adminMenuOpen" : ""}`}>
    <div className="adminTopbarInner">
      <Link className="adminBrand" href="/admin/articles" onClick={() => setOpen(false)}>
        <span className="adminBrandMark">N</span>
        <span><b>NETWISE</b><small>CONTROL CENTER</small></span>
      </Link>

      <nav className="adminNavigation" aria-label="Điều hướng quản trị">
        {adminLinks.map((link) => <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? "active" : ""} onClick={() => setOpen(false)}><i>{link.icon}</i><span>{link.label}</span></Link>)}
      </nav>

      <div className="adminTopbarActions">
        <Link className="viewWebsite" href="/" target="_blank"><span>↗</span> Xem website</Link>
        <ThemeToggle />
        <div className="adminAccount"><span>A</span><div><b>Admin</b><small>Quản trị viên</small></div></div>
        <form action="/api/auth/logout" method="post"><button className="logoutButton" title="Đăng xuất" aria-label="Đăng xuất">↪</button></form>
        <button className="adminMenuButton" type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><i /><i /><i /></button>
      </div>
    </div>
  </header>;
}
