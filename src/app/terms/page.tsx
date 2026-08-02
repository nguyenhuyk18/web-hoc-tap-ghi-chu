import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { sortTerms, termFromFirestore } from "@/lib/firestore-terms";

export const dynamic = "force-dynamic";

export default async function TermsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const query = await searchParams; const page = Math.max(1, Number(query.page) || 1); const limit = 20; const search = query.search?.trim() || "";
  const snapshot = await getAdminFirestore().collection("terms").get();
  const normalizedSearch = search.toLocaleLowerCase("vi");
  const allTerms = sortTerms(snapshot.docs.map(termFromFirestore)).filter((term) => !normalizedSearch || term.name.toLocaleLowerCase("vi").includes(normalizedSearch));
  const total = allTerms.length; const terms = allTerms.slice((page - 1) * limit, page * limit);
  const pages = Math.max(1, Math.ceil(total / limit)); const suffix = search ? `&search=${encodeURIComponent(search)}` : "";
  return <div className="publicSite"><PublicHeader /><main className="termsPage shell">
    <header><small>TỪ ĐIỂN MẠNG MÁY TÍNH</small><h1>Thuật ngữ</h1><p>Tra cứu nhanh những khái niệm thường gặp trong mạng máy tính.</p></header>
    <form className="termSearch"><input name="search" defaultValue={search} placeholder="Tìm kiếm thuật ngữ..." /><button>Tìm kiếm</button>{search && <Link href="/terms">Xóa bộ lọc</Link>}</form>
    <div className="termCount">{total} thuật ngữ</div>
    {terms.length === 0 ? <div className="publicEmpty">Không tìm thấy thuật ngữ phù hợp.</div> : <div className="termList">{terms.map((term, index) => <article key={term._id}><span>{String((page - 1) * limit + index + 1).padStart(2, "0")}</span><div><h2>{term.name}</h2><p>{term.description}</p></div></article>)}</div>}
    {pages > 1 && <nav className="pagination"><Link className={page <= 1 ? "disabled" : ""} href={`/terms?page=${page - 1}${suffix}`}>← Trước</Link><span>Trang {page} / {pages}</span><Link className={page >= pages ? "disabled" : ""} href={`/terms?page=${page + 1}${suffix}`}>Sau →</Link></nav>}
  </main></div>;
}
