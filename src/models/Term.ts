import { model, models, Schema } from "mongoose";

const termSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: { type: String, required: true, default: "IT Network", trim: true },
  },
  { timestamps: true },
);

const cachedTerm = models.Term;

// Next.js giữ model Mongoose giữa các lần hot reload. Khi schema vừa được mở
// rộng, bổ sung path mới vào model đang cache để Mongoose không loại bỏ `type`.
if (cachedTerm && !cachedTerm.schema.path("type")) {
  cachedTerm.schema.add({ type: { type: String, required: true, default: "IT Network", trim: true } });
}

export const Term = cachedTerm ?? model("Term", termSchema);
