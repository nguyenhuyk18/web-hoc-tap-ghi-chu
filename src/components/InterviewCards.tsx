"use client";
import { useState } from "react";

type Card = { id: string; question: string; answer: string; type: string };
export function InterviewCards({ initialCards }: { initialCards: Card[] }) {
  const [cards, setCards] = useState(initialCards); const [current, setCurrent] = useState(0); const [flipped, setFlipped] = useState(false); const card = cards[current];
  function go(index: number) { if (!cards.length) return; setCurrent((index + cards.length) % cards.length); setFlipped(false); }
  function shuffle() { setCards((items) => [...items].sort(() => Math.random() - .5)); setCurrent(0); setFlipped(false); }
  if (!card) return <div className="studyEmpty"><span>◇</span><h2>Chưa có câu hỏi phỏng vấn</h2><p>Hãy chọn ngành khác hoặc thêm câu hỏi trong trang quản trị.</p></div>;
  return <div className="studyExperience">
    <div className="studyToolbar"><div><span>{current + 1}</span> / {cards.length}</div><div className="studyToolbarActions"><button onClick={shuffle}>⤨ Xáo trộn</button></div></div>
    <div className="studyProgress"><span style={{ width: `${((current + 1) / cards.length) * 100}%` }} /></div>
    <button className={`flashcard interviewFlashcard${flipped ? " flipped" : ""}`} onClick={() => setFlipped((value) => !value)}>
      <span className="flashcardInner"><span className="flashcardFace flashcardFront"><small>{card.type} · CÂU HỎI</small><b>{card.question}</b><em>Nhấn để xem câu trả lời <i>↻</i></em></span><span className="flashcardFace flashcardBack"><small>{card.type} · GỢI Ý TRẢ LỜI</small><b>{card.question}</b><p>{card.answer}</p><em>Nhấn để quay lại <i>↻</i></em></span></span>
    </button>
    <div className="studyNavigation interviewNavigation"><button onClick={() => go(current - 1)}>←</button><div><button className="reviewButton" onClick={() => go(current + 1)}>Câu tiếp theo →</button></div><button onClick={() => go(current + 1)}>→</button></div>
  </div>;
}
