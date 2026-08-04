import { model, models, Schema } from "mongoose";

const specialtySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export const Specialty = models.Specialty ?? model("Specialty", specialtySchema);
