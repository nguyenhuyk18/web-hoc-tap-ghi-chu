import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/articles";
import { connectMongoDB } from "@/lib/mongodb";
import { UniversitySubject } from "@/models/UniversitySubject";

export async function GET() { await connectMongoDB(); return NextResponse.json({ subjects: await UniversitySubject.find().sort({ createdAt: -1 }).lean() }); }
export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  try { await connectMongoDB(); const body=await request.json(); const slug=makeSlug(body.slug || body.name || ""); if(!body.name?.trim() || !slug) throw new Error("Vui lòng nhập tên môn học"); if(await UniversitySubject.exists({slug})) throw new Error("Đường dẫn môn học đã tồn tại"); const subject=await UniversitySubject.create({ name:body.name.trim(), code:body.code?.trim()||"", slug, description:body.description?.trim()||"", color:body.color||"#2563eb" }); return NextResponse.json({subject},{status:201}); }
  catch(error){ return NextResponse.json({error:error instanceof Error?error.message:"Không thể tạo môn học"},{status:400}); }
}
