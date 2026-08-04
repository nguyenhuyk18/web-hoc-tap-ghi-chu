import { notFound } from "next/navigation";
import { InterviewQuestionForm } from "@/components/InterviewQuestionForm";
import { connectMongoDB } from "@/lib/mongodb";
import { getSpecialties } from "@/lib/specialties";
import { InterviewQuestion } from "@/models/InterviewQuestion";
export default async function EditInterviewQuestionPage({ params }: { params: Promise<{ id: string }> }) { await connectMongoDB(); const { id } = await params; const [item, specialties] = await Promise.all([InterviewQuestion.findById(id).lean(), getSpecialties()]); if (!item) notFound(); return <section className="adminContent termEditorPage"><div className="adminTitle"><div><small>PHỎNG VẤN</small><h1>Sửa câu hỏi</h1></div></div><InterviewQuestionForm item={JSON.parse(JSON.stringify(item))} specialties={specialties.map((specialty) => String(specialty.name))} /></section>; }
