import { connectMongoDB } from "@/lib/mongodb";
import { Specialty } from "@/models/Specialty";

export const DEFAULT_SPECIALTY = "IT Network";

export async function getSpecialties() {
  await connectMongoDB();
  if (!(await Specialty.exists({}))) {
    await Specialty.create({ name: DEFAULT_SPECIALTY, description: "Kiến thức mạng máy tính và hạ tầng IT." });
  }
  return Specialty.find().sort({ name: 1 }).lean();
}
