import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/ArticleEditor";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { getSpecialties } from "@/lib/specialties";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await connectMongoDB(); const { id } = await params; const [article, specialties] = await Promise.all([Article.findById(id).lean(), getSpecialties()]); if (!article) notFound();
  return <section className="adminContent editorPage"><div className="adminTitle"><div><small>SOẠN THẢO</small><h1>Chỉnh sửa bài viết</h1></div></div><ArticleEditor article={JSON.parse(JSON.stringify(article))} specialties={specialties.map((item) => String(item.name))} /></section>;
}
