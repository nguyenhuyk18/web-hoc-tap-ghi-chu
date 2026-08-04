import Link from "next/link";
import { getSpecialties } from "@/lib/specialties";
import { SpecialtyDeleteButton } from "@/components/SpecialtyDeleteButton";

export default async function AdminSpecialtiesPage() {
  const specialties = await getSpecialties();
  return <section className="adminContent"><div className="adminTitle"><div><small>PHÂN LOẠI NỘI DUNG</small><h1>Chuyên ngành</h1></div><Link className="primary" href="/admin/specialties/new">+ Thêm chuyên ngành</Link></div>
    <div className="adminTable specialtyAdminTable"><div className="tableRow tableHead"><span>Tên chuyên ngành</span><span>Mô tả</span><span>Thao tác</span></div>
      {specialties.map((item) => { const id = String(item._id); return <div className="tableRow" key={id}><b>{String(item.name)}</b><p>{String(item.description || "Chưa có mô tả")}</p><div className="rowActions"><Link href={`/admin/specialties/${id}/edit`}>Sửa</Link><SpecialtyDeleteButton id={id} /></div></div>; })}
    </div>
  </section>;
}
