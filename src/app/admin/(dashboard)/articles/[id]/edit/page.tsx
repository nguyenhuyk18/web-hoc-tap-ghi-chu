import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/ArticleEditor";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { articleFromFirestore } from "@/lib/firestore-data";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const snapshot = await getAdminFirestore().collection("articles").doc(id).get(); if (!snapshot.exists) notFound();
  const article = articleFromFirestore(snapshot); const value = { ...article, createdAt: article.createdAt.toISOString(), updatedAt: article.updatedAt.toISOString() };
  return <section className="adminContent editorPage"><div className="adminTitle"><div><small>SOẠN THẢO</small><h1>Chỉnh sửa bài viết</h1></div></div><ArticleEditor article={value} /></section>;
}
