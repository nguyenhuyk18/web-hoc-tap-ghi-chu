import { model, models, Schema } from "mongoose";

const interviewQuestionSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    type: { type: String, required: true, default: "IT Network", trim: true },
  },
  { timestamps: true },
);

interviewQuestionSchema.index({ type: 1, createdAt: -1 });

export const InterviewQuestion = models.InterviewQuestion ?? model("InterviewQuestion", interviewQuestionSchema);
