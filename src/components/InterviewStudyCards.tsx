"use client";
import { useMemo, useState } from "react";

type Question = { id: string; question: string; answer: string; type: string };

function shuffle<T>(items: T[]) { const result = [...items]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; }

export function InterviewStudyCards({ initialQuestions, specialties }: { initialQuestions: Question[]; specialties: string[] }) {
  const [selectedType, setSelectedType] = useState(""); const [order, setOrder] = useState<string[]>(initialQuestions.map((item) => item.id)); const [current, setCurrent] = useState(0); const [flipped, setFlipped] = useState(false); const [known, setKnown] = useState<Set<string>>(new Set()); const [review, setReview] = useState<Set<string>>(new Set());
  const questions = useMemo(() => order.map((id) => initialQuestions.find((item) => item.id === id)).filter((item): item is Question => Boolean(item)).filter((item) => !selectedType || item.type === selectedType), [initialQuestions, order, selectedType]);
  const item = questions[current];
  function reset(type = selectedType) { setSelectedType(type); setCurrent(0); setFlipped(false); setKnown(new Set()); setReview(new Set()); }
  function move(offset: number) { if (!questions.length) return; setCurrent((current + offset + questions.length) % questions.length); setFlipped(false); }
  function mark(target: "known" | "review") { if (!item) return; if (target === "known") { setKnown((set) => new Set(set).add(item.id)); setReview((set) => { const next = new Set(set); next.delete(item.id); return next; }); } else { setReview((set) => new Set(set).add(item.id)); setKnown((set) => { const next = new Set(set); next.delete(item.id); return next; }); } move(1); }
  function mix() { setOrder(shuffle(order)); setCurrent(0); setFlipped(false); }

  return <div className="interviewStudy">
    <div className="interviewSpecialtyPicker"><label>Chọn chuyên ngành<select value={selectedType} onChange={(event) => reset(event.target.value)}><option value="">Tất cả chuyên ngành</option>{specialties.map((name) => <option key={name}>{name}</option>)}</select></label><span>{questions.length} câu hỏi</span></div>
    {!item ? <div className="studyEmpty"><span>◇</span><h2>Chưa có câu hỏi</h2><p>Hãy thêm câu hỏi phỏng vấn cho chuyên ngành này trước.</p></div> : <div className="studyExperience">
      <div className="studyToolbar"><div><span>{current + 1}</span> / {questions.length}</div><div className="studyToolbarActions"><button onClick={() => reset()}>↺ Học lại</button><button onClick={mix}>⤨ Xáo trộn</button></div></div>
      <div className="studyProgress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
      <button className={`flashcard interviewFlashcard${flipped ? " flipped" : ""}`} onClick={() => setFlipped((value) => !value)}>
        <span className="flashcardInner"><span className="flashcardFace flashcardFront"><small>{item.type} · CÂU HỎI PHỎNG VẤN</small><b>{item.question}</b><em>Nhấn để xem câu trả lời <i>↻</i></em></span><span className="flashcardFace flashcardBack"><small>{item.type} · CÂU TRẢ LỜI GỢI Ý</small><b>{item.question}</b><p>{item.answer}</p><em>Nhấn để quay lại <i>↻</i></em></span></span>
      </button>
      <div className="studyNavigation"><button onClick={() => move(-1)}>←</button><div><button className="reviewButton" onClick={() => mark("review")}><span>↺</span> Cần ôn</button><button className="rememberButton" onClick={() => mark("known")}><span>✓</span> Đã nắm</button></div><button onClick={() => move(1)}>→</button></div>
      <div className="studyStats"><div><b>{known.size + review.size}</b><span>Đã trả lời</span></div><div><b>{known.size}</b><span>Đã nắm</span></div><div><b>{review.size}</b><span>Cần ôn</span></div></div>
    </div>}
  </div>;
}
