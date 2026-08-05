import { notFound } from "next/navigation";
import { SubjectForm } from "@/components/SubjectForm";
import { connectMongoDB } from "@/lib/mongodb";
import { UniversitySubject } from "@/models/UniversitySubject";
export default async function EditSubjectPage({params}:{params:Promise<{id:string}>}){await connectMongoDB();const {id}=await params;const item=await UniversitySubject.findById(id).lean();if(!item)notFound();return <section className="adminContent termEditorPage"><div className="adminTitle"><div><small>ĐẠI HỌC</small><h1>Sửa môn học</h1></div></div><SubjectForm subject={{_id:String(item._id),name:String(item.name),code:String(item.code||""),slug:String(item.slug),description:String(item.description||""),color:String(item.color||"#2563eb")}}/></section>}
