"use client";
import { useMemo, useState } from "react";
import { InterviewCards } from "@/components/InterviewCards";

type Question = { id: string; question: string; answer: string; type: string };

export function InterviewStudyCards({ initialQuestions, specialties }: { initialQuestions: Question[]; specialties: string[] }) {
  const [selectedType, setSelectedType] = useState("");
  const questions = useMemo(() => initialQuestions.filter((item) => !selectedType || item.type === selectedType), [initialQuestions, selectedType]);
  return <div className="interviewStudy">
    <div className="interviewSpecialtyPicker"><label>Chọn chuyên ngành<select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}><option value="">Tất cả chuyên ngành</option>{specialties.map((name) => <option key={name}>{name}</option>)}</select></label><span>{questions.length} câu hỏi</span></div>
    <InterviewCards key={selectedType || "all"} initialCards={questions} />
  </div>;
}
