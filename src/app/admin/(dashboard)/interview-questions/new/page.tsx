import { InterviewQuestionForm } from "@/components/InterviewQuestionForm";
import { getSpecialties } from "@/lib/specialties";
export default async function NewInterviewQuestionPage() { const specialties = await getSpecialties(); return <section className="adminContent termEditorPage"><div className="adminTitle"><div><small>PHỎNG VẤN</small><h1>Thêm câu hỏi</h1></div></div><InterviewQuestionForm specialties={specialties.map((item) => String(item.name))} /></section>; }
