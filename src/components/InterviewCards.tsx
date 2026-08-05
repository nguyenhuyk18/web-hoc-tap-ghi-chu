"use client";
import { useState } from "react";

type Card = { id: string; question: string; answer: string; type: string };

export function InterviewCards({ initialCards }: { initialCards: Card[] }) {
  const [cards, setCards] = useState(initialCards); const [current, setCurrent] = useState(0); const [revealed, setRevealed] = useState(false); const card = cards[current];
  function go(index: number) { if (!cards.length) return; setCurrent((index + cards.length) % cards.length); setRevealed(false); }
  function shuffle() { setCards((items) => [...items].sort(() => Math.random() - .5)); setCurrent(0); setRevealed(false); }
  if (!card) return <div className="studyEmpty"><span>◇</span><h2>Chưa có câu hỏi phỏng vấn</h2><p>Hãy chọn ngành khác hoặc thêm câu hỏi trong trang quản trị.</p></div>;
  return <section className="interviewPractice">
    <header className="practiceHeader"><div><small>PHIÊN LUYỆN TẬP</small><span><b>{current + 1}</b> / {cards.length} câu hỏi</span></div><button onClick={shuffle}>⤨ Xáo trộn câu hỏi</button></header>
    <div className="practiceProgress"><span style={{ width: `${((current + 1) / cards.length) * 100}%` }} /></div>
    <article className="practiceQuestion">
      <div className="questionMeta"><span>{card.type}</span><i>CÂU {String(current + 1).padStart(2, "0")}</i></div>
      <h2>{card.question}</h2>
      <div className="answerPrompt"><span>Hãy tự trình bày câu trả lời trước khi xem gợi ý.</span><button onClick={() => setRevealed((value) => !value)}>{revealed ? "Ẩn câu trả lời" : "Xem câu trả lời gợi ý"} <i>{revealed ? "↑" : "↓"}</i></button></div>
    </article>
    {revealed && <article className="practiceAnswer"><div className="answerTitle"><span>✓</span><div><small>GỢI Ý TRẢ LỜI</small><b>Nội dung tham khảo</b></div></div><div className="richTextContent practiceAnswerContent" dangerouslySetInnerHTML={{ __html: card.answer }} /></article>}
    <footer className="practiceNavigation"><button onClick={() => go(current - 1)}><span>←</span><i>Câu trước</i></button><div>{cards.map((item, index) => <button aria-label={`Đến câu ${index + 1}`} className={index === current ? "active" : ""} key={item.id} onClick={() => go(index)} />)}</div><button onClick={() => go(current + 1)}><i>Câu tiếp theo</i><span>→</span></button></footer>
  </section>;
}
