import Link from "next/link";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { sortTerms, termFromFirestore } from "@/lib/firestore-terms";
import { TermDeleteButton } from "@/components/TermDeleteButton";

export default async function AdminTermsPage() {
  const snapshot = await getAdminFirestore().collection("terms").get(); const terms = sortTerms(snapshot.docs.map(termFromFirestore));
  return <section className="adminContent"><div className="adminTitle"><div><small>QUẢN LÝ NỘI DUNG</small><h1>Thuật ngữ</h1></div><Link className="primary" href="/admin/terms/new">+ Thêm thuật ngữ</Link></div>
    <div className="adminTable termAdminTable"><div className="tableRow tableHead"><span>Tên thuật ngữ</span><span>Diễn giải</span><span>Thao tác</span></div>
      {terms.length === 0 && <div className="emptyState">Chưa có thuật ngữ nào.</div>}
      {terms.map((term) => <div className="tableRow" key={term._id}><b>{term.name}</b><p>{term.description}</p><div className="rowActions"><Link href={`/admin/terms/${term._id}/edit`}>Sửa</Link><TermDeleteButton id={term._id} /></div></div>)}
    </div>
  </section>;
}
