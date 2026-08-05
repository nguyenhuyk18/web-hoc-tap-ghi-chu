import { notFound } from "next/navigation";
import { CourseNoteForm } from "@/components/CourseNoteForm";
import { connectMongoDB } from "@/lib/mongodb";
import { CourseNote } from "@/models/CourseNote";
import { UniversitySubject } from "@/models/UniversitySubject";
export default async function EditNotePage({params}:{params:Promise<{id:string}>}){await connectMongoDB();const {id}=await params;const [note,items]=await Promise.all([CourseNote.findById(id).lean(),UniversitySubject.find().sort({name:1}).lean()]);if(!note)notFound();return <section className="adminContent editorPage"><div className="adminTitle"><div><small>GHI CHÚ HỌC TẬP</small><h1>Sửa note</h1></div></div><CourseNoteForm note={{_id:String(note._id),subjectId:String(note.subjectId),title:String(note.title),slug:String(note.slug),summary:String(note.summary),content:String(note.content),published:Boolean(note.published)}} subjects={items.map(item=>({id:String(item._id),name:String(item.name),code:String(item.code||"")}))}/></section>}
