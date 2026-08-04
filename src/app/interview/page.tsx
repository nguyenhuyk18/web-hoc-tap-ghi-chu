import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { InterviewCards } from "@/components/InterviewCards";
import { connectMongoDB } from "@/lib/mongodb";
import { getSpecialties } from "@/lib/specialties";
import { InterviewQuestion } from "@/models/InterviewQuestion";

export const dynamic = "force-dynamic";
export default async function InterviewPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await connectMongoDB(); const query = await searchParams; const specialties = await getSpecialties(); const names = specialties.map((item) => String(item.name));
  const selectedType = names.includes(query.type || "") ? query.type || "" : ""; const questions = await InterviewQuestion.find(selectedType ? { type: selectedType } : {}).sort({ createdAt: -1 }).limit(300).lean();
  const cards = questions.map((item) => ({ id: String(item._id), question: String(item.question), answer: String(item.answer), type: String(item.type) }));
  return <div className="publicSite learnSite"><PublicHeader /><main className="learnPage shell"><header><small>INTERVIEW PRACTICE</small><h1>Luyện câu hỏi phỏng vấn,<br /><span>tự tin ứng tuyển.</span></h1><p>Chọn chuyên ngành, tự trả lời rồi lật thẻ để đối chiếu gợi ý.</p></header><nav className="articleTypeFilters interviewTypeFilters"><Link className={!selectedType ? "active" : ""} href="/interview">Tất cả</Link>{names.map((name) => <Link className={selectedType === name ? "active" : ""} href={`/interview?type=${encodeURIComponent(name)}`} key={name}>{name}</Link>)}</nav><InterviewCards key={selectedType || "all"} initialCards={cards} /></main></div>;
}
