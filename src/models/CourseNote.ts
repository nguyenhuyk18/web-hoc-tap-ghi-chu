import { model, models, Schema } from "mongoose";

const courseNoteSchema = new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: "UniversitySubject", required: true, index: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  content: { type: String, required: true, default: "" },
  published: { type: Boolean, default: false },
}, { timestamps: true });

courseNoteSchema.index({ subjectId: 1, slug: 1 }, { unique: true });
courseNoteSchema.index({ subjectId: 1, published: 1, createdAt: -1 });
export const CourseNote = models.CourseNote ?? model("CourseNote", courseNoteSchema);
