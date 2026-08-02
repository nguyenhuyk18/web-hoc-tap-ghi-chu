import { PublicHeader } from "@/components/PublicHeader";
import { StudyCards } from "@/components/StudyCards";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { sortTerms, termFromFirestore } from "@/lib/firestore-terms";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const snapshot = await getAdminFirestore().collection("terms").get();
  const values = sortTerms(snapshot.docs.map(termFromFirestore)).slice(0, 300).map((term) => ({ id: term._id, name: term.name, description: term.description }));
  return <div className="publicSite learnSite"><PublicHeader /><main className="learnPage shell"><header><small>FLASHCARD LEARNING</small><h1>Học từng thuật ngữ,<br /><span>nhớ thật lâu.</span></h1><p>Lật thẻ để khám phá diễn giải và tự đánh giá mức độ ghi nhớ của bạn.</p></header><StudyCards initialTerms={values} /></main></div>;
}
