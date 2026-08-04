import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { readTime } from "@/lib/articles";
import { DEFAULT_SPECIALTY, getSpecialties } from "@/lib/specialties";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";
export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string; type?: string }> }) {
  const query = await searchParams; const page = Math.max(1, Number(query.page) || 1); const limit = 9;
  const specialties = await getSpecialties(); const specialtyNames = specialties.map((item) => String(item.name));
  const selectedType = specialtyNames.includes(query.type || "") ? query.type || "" : "";
  const typeFilter = selectedType === DEFAULT_SPECIALTY ? { $or: [{ type: DEFAULT_SPECIALTY }, { type: { $exists: false } }] } : selectedType ? { type: selectedType } : {};
  const filter = { published: true, ...typeFilter };
  await connectMongoDB();
  const [articles, total] = await Promise.all([Article.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Article.countDocuments(filter)]);
  const pages = Math.max(1, Math.ceil(total / limit));
  const typeSuffix = selectedType ? `&type=${encodeURIComponent(selectedType)}` : "";
  return <div className="publicSite"><PublicHeader /><main className="articlesPage shell"><header><small>THƯ VIỆN KIẾN THỨC IT</small><h1>{selectedType || "Tất cả bài viết"}</h1><p>Kiến thức thực tế dành cho IT Network, Tester, Frontend và Backend.</p></header>
    <nav className="articleTypeFilters" aria-label="Lọc bài viết theo chuyên ngành"><Link className={!selectedType ? "active" : ""} href="/articles">Tất cả</Link>{specialtyNames.map((type) => <Link className={selectedType === type ? "active" : ""} href={`/articles?type=${encodeURIComponent(type)}`} key={type}>{type}</Link>)}</nav>
    {articles.length === 0 ? <div className="publicEmpty">Chưa có bài viết thuộc chuyên ngành này.</div> : <div className="articleGrid">{articles.map((item) => <Link className="articleCard" href={`/articles/${item.slug}`} key={String(item._id)}>{item.coverImage ? <img src={String(item.coverImage)} alt="" /> : <div className="cardVisual"><span>{String(item.type || DEFAULT_SPECIALTY).slice(0,2).toUpperCase()}</span></div>}<div className="cardBody"><div><small>{String(item.type || DEFAULT_SPECIALTY)} · {String(item.category)}</small><span>{readTime(String(item.content))} phút đọc</span></div><h2>{String(item.title)}</h2><p>{String(item.summary)}</p><b>Đọc bài viết →</b></div></Link>)}</div>}
    {pages > 1 && <nav className="pagination"><Link className={page <= 1 ? "disabled" : ""} href={`/articles?page=${page - 1}${typeSuffix}`}>← Trước</Link><span>Trang {page} / {pages}</span><Link className={page >= pages ? "disabled" : ""} href={`/articles?page=${page + 1}${typeSuffix}`}>Sau →</Link></nav>}
  </main></div>;
}
