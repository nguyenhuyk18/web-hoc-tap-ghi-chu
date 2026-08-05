import Link from "next/link";
import { CourseNoteForm } from "@/components/CourseNoteForm";
import { connectMongoDB } from "@/lib/mongodb";
import { UniversitySubject } from "@/models/UniversitySubject";
export default async function NewNotePage({searchParams}:{searchParams:Promise<{subjectId?:string}>}){await connectMongoDB();const query=await searchParams;const items=await UniversitySubject.find().sort({name:1}).lean();const subjects=items.map(item=>({id:String(item._id),name:String(item.name),code:String(item.code||"")}));return <section className="adminContent editorPage"><div className="adminTitle"><div><small>GHI CHÚ HỌC TẬP</small><h1>Thêm note mới</h1></div></div>{subjects.length?<CourseNoteForm note={{subjectId:query.subjectId}} subjects={subjects}/>:<div className="emptyState">Bạn cần <Link href="/admin/subjects/new">tạo môn học</Link> trước khi thêm note.</div>}</section>}
