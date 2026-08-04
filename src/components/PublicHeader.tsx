"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/articles", label: "Bài viết" },
  { href: "/terms", label: "Thuật ngữ" },
  { href: "/learn", label: "Học tập" },
  { href: "/interview", label: "Phỏng vấn" },
];

export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return <header className={`publicHeader${overlay ? " publicHeaderOverlay" : ""}${open ? " menuOpen" : ""}`}>
    <div className="headerInner shell">
      <Link className="headerBrand" href="/" onClick={() => setOpen(false)} aria-label="Netwise - Trang chủ">
        <span className="brandMark"><i /><i /><b>N</b></span>
        <span className="brandWord">NET<em>WISE</em></span>
      </Link>

      <nav className="headerNav" aria-label="Điều hướng chính">
        {links.map((link) => <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? "active" : ""} onClick={() => setOpen(false)}>{link.label}</Link>)}
      </nav>

      <div className="headerActions">
        <ThemeToggle />
        <Link className="headerCta" href="/articles">Khám phá <span>↗</span></Link>
        <button className="menuButton" type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><i /><i /></button>
      </div>
    </div>
  </header>;
}
