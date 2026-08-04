import { InterviewStudyCards } from "@/components/InterviewStudyCards";
import { connectMongoDB } from "@/lib/mongodb";
import { getSpecialties } from "@/lib/specialties";
import { InterviewQuestion } from "@/models/InterviewQuestion";
export default async function InterviewStudyPage() { await connectMongoDB(); const [items, specialties] = await Promise.all([InterviewQuestion.find().sort({ createdAt: -1 }).lean(), getSpecialties()]); const questions = items.map((item) => ({ id: String(item._id), question: String(item.question), answer: String(item.answer), type: String(item.type) })); return <section className="adminContent interviewStudyPage"><div className="adminTitle"><div><small>FLASHCARD PHỎNG VẤN</small><h1>Ôn phỏng vấn</h1></div><LinkBack /></div><InterviewStudyCards initialQuestions={questions} specialties={specialties.map((item) => String(item.name))} /></section>; }
function LinkBack() { return <a className="primary" href="/admin/interview-questions">Quản lý câu hỏi</a>; }
