import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import { Term } from "@/models/Term";
import { TermDeleteButton } from "@/components/TermDeleteButton";
import { DEFAULT_SPECIALTY } from "@/lib/specialties";
import { richTextToPlainText } from "@/lib/rich-text";

export default async function AdminTermsPage() {
  await connectMongoDB(); const terms = await Term.find().sort({ name: 1 }).lean();
  return <section className="adminContent"><div className="adminTitle"><div><small>QUẢN LÝ NỘI DUNG</small><h1>Thuật ngữ</h1></div><Link className="primary" href="/admin/terms/new">+ Thêm thuật ngữ</Link></div>
    <div className="adminTable termAdminTable"><div className="tableRow tableHead"><span>Tên thuật ngữ</span><span>Chuyên ngành</span><span>Diễn giải</span><span>Thao tác</span></div>
      {terms.length === 0 && <div className="emptyState">Chưa có thuật ngữ nào.</div>}
      {terms.map((term) => { const id = String(term._id); return <div className="tableRow" key={id}><b>{String(term.name)}</b><span>{String(term.type || DEFAULT_SPECIALTY)}</span><p>{richTextToPlainText(String(term.description))}</p><div className="rowActions"><Link href={`/admin/terms/${id}/edit`}>Sửa</Link><TermDeleteButton id={id} /></div></div>; })}
    </div>
  </section>;
}
