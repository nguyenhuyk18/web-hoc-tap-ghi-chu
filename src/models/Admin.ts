import { model, models, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Quản trị viên" },
  },
  { timestamps: true },
);

export const Admin = models.Admin ?? model("Admin", adminSchema);
