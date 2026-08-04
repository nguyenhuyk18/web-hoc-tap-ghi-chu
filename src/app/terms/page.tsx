import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { connectMongoDB } from "@/lib/mongodb";
import { Term } from "@/models/Term";
import { DEFAULT_SPECIALTY, getSpecialties } from "@/lib/specialties";

export const dynamic = "force-dynamic";

export default async function TermsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; type?: string }> }) {
  await connectMongoDB(); const query = await searchParams; const page = Math.max(1, Number(query.page) || 1); const limit = 20; const search = query.search?.trim() || "";
  const specialties = await getSpecialties(); const specialtyNames = specialties.map((item) => String(item.name)); const selectedType = specialtyNames.includes(query.type || "") ? query.type || "" : "";
  const typeFilter = selectedType === DEFAULT_SPECIALTY ? { $or: [{ type: DEFAULT_SPECIALTY }, { type: { $exists: false } }] } : selectedType ? { type: selectedType } : {};
  const filter = { ...(search ? { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {}), ...typeFilter };
  const [terms, total] = await Promise.all([Term.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(), Term.countDocuments(filter)]);
  const pages = Math.max(1, Math.ceil(total / limit)); const suffix = `${search ? `&search=${encodeURIComponent(search)}` : ""}${selectedType ? `&type=${encodeURIComponent(selectedType)}` : ""}`;
  return <div className="publicSite"><PublicHeader /><main className="termsPage shell">
    <header><small>TỪ ĐIỂN KIẾN THỨC IT</small><h1>Thuật ngữ</h1><p>Tra cứu khái niệm theo từng chuyên ngành IT.</p></header>
    <nav className="articleTypeFilters termTypeFilters" aria-label="Lọc thuật ngữ theo chuyên ngành"><Link className={!selectedType ? "active" : ""} href="/terms">Tất cả</Link>{specialtyNames.map((type) => <Link className={selectedType === type ? "active" : ""} href={`/terms?type=${encodeURIComponent(type)}`} key={type}>{type}</Link>)}</nav>
    <form className="termSearch"><input type="hidden" name="type" value={selectedType} /><input name="search" defaultValue={search} placeholder="Tìm kiếm thuật ngữ..." /><button>Tìm kiếm</button>{search && <Link href={selectedType ? `/terms?type=${encodeURIComponent(selectedType)}` : "/terms"}>Xóa tìm kiếm</Link>}</form>
    <div className="termCount">{total} thuật ngữ</div>
    {terms.length === 0 ? <div className="publicEmpty">Không tìm thấy thuật ngữ phù hợp.</div> : <div className="termList">{terms.map((term, index) => <article key={String(term._id)}><span>{String((page - 1) * limit + index + 1).padStart(2, "0")}</span><div><small>{String(term.type || DEFAULT_SPECIALTY)}</small><h2>{String(term.name)}</h2><p>{String(term.description)}</p></div></article>)}</div>}
    {pages > 1 && <nav className="pagination"><Link className={page <= 1 ? "disabled" : ""} href={`/terms?page=${page - 1}${suffix}`}>← Trước</Link><span>Trang {page} / {pages}</span><Link className={page >= pages ? "disabled" : ""} href={`/terms?page=${page + 1}${suffix}`}>Sau →</Link></nav>}
  </main></div>;
}
