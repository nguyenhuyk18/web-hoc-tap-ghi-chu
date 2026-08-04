import { model, models, Schema } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    type: {
      type: String,
      default: "IT Network",
      required: true,
    },
    category: {
      type: String,
      enum: ["Cơ bản", "Giao thức", "Bảo mật", "Thực hành"],
      required: true,
    },
    level: {
      type: String,
      enum: ["Nhập môn", "Trung cấp", "Nâng cao"],
      default: "Nhập môn",
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

articleSchema.index({ published: 1, createdAt: -1 });
articleSchema.index({ type: 1, published: 1, createdAt: -1 });

export const Article = models.Article ?? model("Article", articleSchema);
