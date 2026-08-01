import Link from "next/link";
export function PublicHeader() {
  return <nav className="nav shell"><Link className="brand" href="/">NET<span>WISE</span></Link><div className="navlinks"><Link href="/articles">Các bài viết</Link><Link href="/terms">Thuật ngữ</Link></div><Link className="navCta" href="/terms">Xem thuật ngữ <span>→</span></Link></nav>;
}
