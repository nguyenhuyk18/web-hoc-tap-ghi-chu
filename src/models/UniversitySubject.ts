import { model, models, Schema } from "mongoose";

const universitySubjectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, default: "", trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "", trim: true },
  color: { type: String, default: "#2563eb", trim: true },
}, { timestamps: true });

universitySubjectSchema.index({ createdAt: -1 });
export const UniversitySubject = models.UniversitySubject ?? model("UniversitySubject", universitySubjectSchema);
