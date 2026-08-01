import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/ArticleEditor";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await connectMongoDB(); const { id } = await params; const article = await Article.findById(id).lean(); if (!article) notFound();
  const value = JSON.parse(JSON.stringify(article));
  return <section className="adminContent editorPage"><div className="adminTitle"><div><small>SOẠN THẢO</small><h1>Chỉnh sửa bài viết</h1></div></div><ArticleEditor article={value} /></section>;
}
