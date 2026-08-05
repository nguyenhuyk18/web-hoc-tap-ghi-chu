import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { connectMongoDB } from "@/lib/mongodb";
import { UniversitySubject } from "@/models/UniversitySubject";
import { CourseNote } from "@/models/CourseNote";
import { readTime } from "@/lib/articles";
import { HighlightedNoteContent } from "@/components/HighlightedNoteContent";
export const dynamic="force-dynamic";
export default async function NoteDetailPage({params}:{params:Promise<{slug:string;noteSlug:string}>}){await connectMongoDB();const {slug,noteSlug}=await params;const subject=await UniversitySubject.findOne({slug}).lean();if(!subject)notFound();const note=await CourseNote.findOne({subjectId:subject._id,slug:noteSlug,published:true}).lean();if(!note)notFound();return <div className="publicSite"><PublicHeader/><main className="articleDetail noteDetail"><header className="shell"><Link href={`/subjects/${subject.slug}`}>← {String(subject.name)}</Link><div><small>{String(subject.code||"MÔN HỌC")} · NOTE HỌC TẬP</small><h1>{String(note.title)}</h1><p>{String(note.summary)}</p><span>{readTime(String(note.content))} phút đọc</span></div></header><HighlightedNoteContent html={String(note.content)}/></main></div>}
