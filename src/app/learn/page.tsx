import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { StudyCards } from "@/components/StudyCards";
import { connectMongoDB } from "@/lib/mongodb";
import { Term } from "@/models/Term";
import { DEFAULT_SPECIALTY, getSpecialties } from "@/lib/specialties";

export const dynamic = "force-dynamic";

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await connectMongoDB(); const query = await searchParams; const specialties = await getSpecialties(); const names = specialties.map((item) => String(item.name));
  const selectedType = names.includes(query.type || "") ? query.type || "" : "";
  const typeFilter = selectedType === DEFAULT_SPECIALTY ? { $or: [{ type: DEFAULT_SPECIALTY }, { type: { $exists: false } }] } : selectedType ? { type: selectedType } : {};
  const terms = await Term.find(typeFilter).sort({ name: 1 }).limit(300).lean();
  const values = terms.map((term) => ({ id: String(term._id), name: String(term.name), description: String(term.description), type: String(term.type || DEFAULT_SPECIALTY) }));
  return <div className="publicSite learnSite"><PublicHeader /><main className="learnPage shell"><header><small>FLASHCARD LEARNING</small><h1>Học từng thuật ngữ,<br /><span>nhớ thật lâu.</span></h1><p>Chọn chuyên ngành, lật thẻ và tự đánh giá mức độ ghi nhớ.</p></header><nav className="articleTypeFilters interviewTypeFilters"><Link className={!selectedType ? "active" : ""} href="/learn">Tất cả</Link>{names.map((name) => <Link className={selectedType === name ? "active" : ""} href={`/learn?type=${encodeURIComponent(name)}`} key={name}>{name}</Link>)}</nav><StudyCards key={selectedType || "all"} initialTerms={values} /></main></div>;
}
