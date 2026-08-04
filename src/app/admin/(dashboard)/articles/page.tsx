import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { AdminDeleteButton } from "@/components/AdminDeleteButton";
import { DEFAULT_SPECIALTY } from "@/lib/specialties";

export default async function AdminArticlesPage() {
  await connectMongoDB(); const articles = await Article.find().sort({ createdAt: -1 }).lean();
  return <section className="adminContent"><div className="adminTitle"><div><small>QUẢN LÝ NỘI DUNG</small><h1>Tất cả bài viết</h1></div><Link className="primary" href="/admin/articles/new">+ Thêm bài viết</Link></div>
    <div className="adminTable"><div className="tableRow tableHead"><span>Bài viết</span><span>Chủ đề</span><span>Trạng thái</span><span>Thao tác</span></div>
      {articles.length === 0 && <div className="emptyState">Chưa có bài viết. Hãy tạo bài đầu tiên!</div>}
      {articles.map((item) => <div className="tableRow" key={String(item._id)}><div><b>{String(item.title)}</b><small>/{String(item.slug)}</small></div><span>{String(item.type || DEFAULT_SPECIALTY)} · {String(item.category)}</span><span className={item.published ? "published" : "draft"}>{item.published ? "Đã xuất bản" : "Bản nháp"}</span><div className="rowActions"><Link href={`/admin/articles/${item._id}/edit`}>Sửa</Link><AdminDeleteButton id={String(item._id)} /></div></div>)}
    </div></section>;
}
