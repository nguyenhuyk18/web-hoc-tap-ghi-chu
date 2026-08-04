import { TermForm } from "@/components/TermForm";
import { getSpecialties } from "@/lib/specialties";
export default async function NewTermPage() { const specialties = await getSpecialties(); return <section className="adminContent termEditorPage"><div className="adminTitle"><div><small>THUẬT NGỮ</small><h1>Thêm thuật ngữ</h1></div></div><TermForm specialties={specialties.map((item) => String(item.name))} /></section>; }
