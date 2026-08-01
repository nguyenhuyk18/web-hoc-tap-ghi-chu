import { model, models, Schema } from "mongoose";

const termSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Term = models.Term ?? model("Term", termSchema);
