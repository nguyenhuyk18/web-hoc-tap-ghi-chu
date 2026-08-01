import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { readTime } from "@/lib/articles";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";
export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await connectMongoDB(); const query = await searchParams; const page = Math.max(1, Number(query.page) || 1); const limit = 9;
  const [articles, total] = await Promise.all([Article.find({ published: true }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Article.countDocuments({ published: true })]);
  const pages = Math.max(1, Math.ceil(total / limit));
  return <div className="publicSite"><PublicHeader /><main className="articlesPage shell"><header><small>THƯ VIỆN KIẾN THỨC</small><h1>Tất cả bài viết</h1><p>Khám phá các khái niệm, giao thức và kỹ năng thực hành mạng máy tính.</p></header>
    {articles.length === 0 ? <div className="publicEmpty">Chưa có bài viết được xuất bản.</div> : <div className="articleGrid">{articles.map((item) => <Link className="articleCard" href={`/articles/${item.slug}`} key={String(item._id)}>{item.coverImage ? <img src={String(item.coverImage)} alt="" /> : <div className="cardVisual"><span>{String(item.category).slice(0,2).toUpperCase()}</span></div>}<div className="cardBody"><div><small>{String(item.category)}</small><span>{readTime(String(item.content))} phút đọc</span></div><h2>{String(item.title)}</h2><p>{String(item.summary)}</p><b>Đọc bài viết →</b></div></Link>)}</div>}
    {pages > 1 && <nav className="pagination"><Link className={page <= 1 ? "disabled" : ""} href={`/articles?page=${page - 1}`}>← Trước</Link><span>Trang {page} / {pages}</span><Link className={page >= pages ? "disabled" : ""} href={`/articles?page=${page + 1}`}>Sau →</Link></nav>}
  </main></div>;
}
