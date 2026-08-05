import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import { InterviewQuestion } from "@/models/InterviewQuestion";
import { InterviewQuestionDeleteButton } from "@/components/InterviewQuestionDeleteButton";
import { richTextToPlainText } from "@/lib/rich-text";

export default async function AdminInterviewQuestionsPage() {
  await connectMongoDB(); const questions = await InterviewQuestion.find().sort({ createdAt: -1 }).lean();
  return <section className="adminContent"><div className="adminTitle"><div><small>NGÂN HÀNG PHỎNG VẤN</small><h1>Câu hỏi phỏng vấn</h1></div><div className="adminTitleActions"><Link href="/admin/interview-questions/study">Ôn phỏng vấn</Link><Link className="primary" href="/admin/interview-questions/new">+ Thêm câu hỏi</Link></div></div>
    <div className="adminTable interviewAdminTable"><div className="tableRow tableHead"><span>Câu hỏi</span><span>Chuyên ngành</span><span>Câu trả lời</span><span>Thao tác</span></div>
      {questions.length === 0 && <div className="emptyState">Chưa có câu hỏi phỏng vấn nào.</div>}
      {questions.map((item) => { const id = String(item._id); return <div className="tableRow" key={id}><b>{String(item.question)}</b><span>{String(item.type)}</span><p>{richTextToPlainText(String(item.answer))}</p><div className="rowActions"><Link href={`/admin/interview-questions/${id}/edit`}>Sửa</Link><InterviewQuestionDeleteButton id={id} /></div></div>; })}
    </div>
  </section>;
}
