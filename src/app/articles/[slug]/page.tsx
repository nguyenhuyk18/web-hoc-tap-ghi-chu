import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { articleFromFirestore } from "@/lib/firestore-data";
import { readTime } from "@/lib/articles";

/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const snapshot = await getAdminFirestore().collection("articles").where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) notFound(); const article = articleFromFirestore(snapshot.docs[0]); if (!article.published) notFound();
  return <div className="publicSite"><PublicHeader /><main className="articleDetail"><header className="shell"><Link href="/articles">← Tất cả bài viết</Link><div><small>{String(article.category)} · {String(article.level)}</small><h1>{String(article.title)}</h1><p>{String(article.summary)}</p><span>{readTime(String(article.content))} phút đọc</span></div></header>{article.coverImage && <img className="detailCover" src={String(article.coverImage)} alt={String(article.title)} />}<article className="prose" dangerouslySetInnerHTML={{ __html: String(article.content) }} /></main></div>;
}
