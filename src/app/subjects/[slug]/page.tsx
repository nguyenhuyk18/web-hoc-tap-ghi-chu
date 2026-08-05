import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { connectMongoDB } from "@/lib/mongodb";
import { UniversitySubject } from "@/models/UniversitySubject";
import { CourseNote } from "@/models/CourseNote";
import { readTime } from "@/lib/articles";
export const dynamic="force-dynamic";
export default async function SubjectDetailPage({params}:{params:Promise<{slug:string}>}){await connectMongoDB();const {slug}=await params;const subject=await UniversitySubject.findOne({slug}).lean();if(!subject)notFound();const notes=await CourseNote.find({subjectId:subject._id,published:true}).sort({createdAt:-1}).lean();return <div className="publicSite"><PublicHeader/><main className="subjectDetail shell"><Link className="subjectBack" href="/subjects">← Tất cả môn học</Link><header style={{"--subject-color":String(subject.color||"#2563eb")} as React.CSSProperties}><small>{String(subject.code||"MÔN HỌC ĐẠI HỌC")}</small><h1>{String(subject.name)}</h1><p>{String(subject.description||"Tổng hợp các ghi chú quan trọng của môn học.")}</p><span>{notes.length} note đã xuất bản</span></header><section className="noteList"><div className="noteListTitle"><small>NỘI DUNG MÔN HỌC</small><h2>Ghi chú gần đây</h2></div>{!notes.length?<div className="publicEmpty">Môn học này chưa có note được xuất bản.</div>:notes.map((note,index)=><Link href={`/subjects/${subject.slug}/notes/${note.slug}`} className="noteRow" key={String(note._id)}><span>{String(index+1).padStart(2,"0")}</span><div><small>{readTime(String(note.content))} PHÚT ĐỌC</small><h3>{String(note.title)}</h3><p>{String(note.summary)}</p></div><b>→</b></Link>)}</section></main></div>}
