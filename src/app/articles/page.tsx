import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { articleFromFirestore, sortArticlesNewestFirst } from "@/lib/firestore-data";
import { readTime } from "@/lib/articles";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";
export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams; const page = Math.max(1, Number(query.page) || 1); const limit = 9;
  const snapshot = await getAdminFirestore().collection("articles").get();
  const available = sortArticlesNewestFirst(snapshot.docs.map(articleFromFirestore).filter((article) => article.published));
  const total = available.length; const articles = available.slice((page - 1) * limit, page * limit);
  const pages = Math.max(1, Math.ceil(total / limit));
  return <div className="publicSite"><PublicHeader /><main className="articlesPage shell"><header><small>THƯ VIỆN KIẾN THỨC</small><h1>Tất cả bài viết</h1><p>Khám phá các khái niệm, giao thức và kỹ năng thực hành mạng máy tính.</p></header>
    {articles.length === 0 ? <div className="publicEmpty">Chưa có bài viết được xuất bản.</div> : <div className="articleGrid">{articles.map((item) => <Link className="articleCard" href={`/articles/${item.slug}`} key={String(item._id)}>{item.coverImage ? <img src={String(item.coverImage)} alt="" /> : <div className="cardVisual"><span>{String(item.category).slice(0,2).toUpperCase()}</span></div>}<div className="cardBody"><div><small>{String(item.category)}</small><span>{readTime(String(item.content))} phút đọc</span></div><h2>{String(item.title)}</h2><p>{String(item.summary)}</p><b>Đọc bài viết →</b></div></Link>)}</div>}
    {pages > 1 && <nav className="pagination"><Link className={page <= 1 ? "disabled" : ""} href={`/articles?page=${page - 1}`}>← Trước</Link><span>Trang {page} / {pages}</span><Link className={page >= pages ? "disabled" : ""} href={`/articles?page=${page + 1}`}>Sau →</Link></nav>}
  </main></div>;
}
