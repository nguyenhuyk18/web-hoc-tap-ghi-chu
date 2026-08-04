import { ArticleEditor } from "@/components/ArticleEditor";
import { getSpecialties } from "@/lib/specialties";
export default async function NewArticlePage() { const specialties = await getSpecialties(); return <section className="adminContent editorPage"><div className="adminTitle"><div><small>SOẠN THẢO</small><h1>Thêm bài viết mới</h1></div></div><ArticleEditor specialties={specialties.map((item) => String(item.name))} /></section>; }
