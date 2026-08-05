"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StudyTerm = { id: string; name: string; description: string; type: string };

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const random = Math.floor(Math.random() * (index + 1));
    [result[index], result[random]] = [result[random], result[index]];
  }
  return result;
}

export function StudyCards({ initialTerms, mode = "terms" }: { initialTerms: StudyTerm[]; mode?: "terms" | "interview" }) {
  const [terms, setTerms] = useState(initialTerms);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [remembered, setRemembered] = useState<Set<string>>(new Set());
  const [review, setReview] = useState<Set<string>>(new Set());
  const term = terms[current];
  const answered = useMemo(() => new Set([...remembered, ...review]).size, [remembered, review]);

  function goTo(index: number) {
    if (!terms.length) return;
    setCurrent((index + terms.length) % terms.length);
    setFlipped(false);
  }

  function mark(type: "remembered" | "review") {
    if (!term) return;
    if (type === "remembered") {
      setRemembered((items) => new Set(items).add(term.id));
      setReview((items) => { const next = new Set(items); next.delete(term.id); return next; });
    } else {
      setReview((items) => new Set(items).add(term.id));
      setRemembered((items) => { const next = new Set(items); next.delete(term.id); return next; });
    }
    if (current < terms.length - 1) goTo(current + 1);
  }

  function mixCards() {
    setTerms((items) => shuffle(items)); setCurrent(0); setFlipped(false);
  }

  function restartSession() {
    setTerms(initialTerms);
    setCurrent(0);
    setFlipped(false);
    setRemembered(new Set());
    setReview(new Set());
  }

  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Enter") { event.preventDefault(); setFlipped((value) => !value); }
      if (event.key === "ArrowLeft") goTo(current - 1);
      if (event.key === "ArrowRight") goTo(current + 1);
      if (event.key.toLowerCase() === "r") mark("review");
      if (event.key.toLowerCase() === "k") mark("remembered");
    }
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  });

  if (!term) return <div className="studyEmpty"><span>◇</span><h2>Chưa có {mode === "interview" ? "câu hỏi phỏng vấn" : "thuật ngữ"} để học</h2><p>Hãy thêm nội dung trong trang quản trị trước khi bắt đầu.</p><Link href={mode === "interview" ? "/interview" : "/terms"}>Xem nội dung</Link></div>;

  return <div className="studyExperience">
    <div className="studyToolbar"><div><span>{current + 1}</span> / {terms.length}</div><div className="studyToolbarActions">{answered > 0 && <button className="restartButton" onClick={restartSession}>↺ Ôn lại từ đầu</button>}<button onClick={mixCards}>⤨ Xáo trộn</button></div></div>
    <div className="studyProgress"><span style={{ width: `${Math.max(((current + 1) / terms.length) * 100, 2)}%` }} /></div>

    <button className={`flashcard${flipped ? " flipped" : ""}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? "Xem tên thuật ngữ" : "Xem lời giải thích"}>
      <span className="flashcardInner">
        <span className="flashcardFace flashcardFront"><small>{term.type} · {mode === "interview" ? "CÂU HỎI" : "THUẬT NGỮ"}</small><b>{term.name}</b><em>Nhấn vào thẻ để xem {mode === "interview" ? "câu trả lời" : "diễn giải"} <i>↻</i></em></span>
        <span className="flashcardFace flashcardBack"><small>{term.type} · {mode === "interview" ? "CÂU TRẢ LỜI" : "DIỄN GIẢI"}</small><b>{term.name}</b><span className="richTextContent flashcardRichText" dangerouslySetInnerHTML={{ __html: term.description }} /><em>Nhấn để quay lại <i>↻</i></em></span>
      </span>
    </button>

    <div className="studyNavigation"><button onClick={() => goTo(current - 1)} aria-label="Thẻ trước">←</button><div><button className="reviewButton" onClick={() => mark("review")}><span>↺</span> Chưa nhớ <kbd>R</kbd></button><button className="rememberButton" onClick={() => mark("remembered")}><span>✓</span> Đã nhớ <kbd>K</kbd></button></div><button onClick={() => goTo(current + 1)} aria-label="Thẻ sau">→</button></div>
    <div className="studyStats"><div><b>{answered}</b><span>Đã học</span></div><div><b>{remembered.size}</b><span>Đã nhớ</span></div><div><b>{review.size}</b><span>Cần ôn lại</span></div></div>
    <p className="keyboardHint"><kbd>Space</kbd> lật thẻ · <kbd>←</kbd><kbd>→</kbd> chuyển thẻ</p>
  </div>;
}
