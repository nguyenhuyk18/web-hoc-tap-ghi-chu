import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { makeSlug } from "@/lib/articles";
import { connectMongoDB } from "@/lib/mongodb";
import { CourseNote } from "@/models/CourseNote";
import { UniversitySubject } from "@/models/UniversitySubject";
type Context={params:Promise<{id:string}>};
export async function PUT(request:NextRequest,{params}:Context){ if(!(await getSession())) return NextResponse.json({error:"Chưa đăng nhập"},{status:401}); try{ await connectMongoDB(); const {id}=await params; const body=await request.json(); const slug=makeSlug(body.slug||body.name||""); if(!body.name?.trim()||!slug) throw new Error("Vui lòng nhập tên môn học"); if(await UniversitySubject.exists({slug,_id:{$ne:id}})) throw new Error("Đường dẫn môn học đã tồn tại"); const subject=await UniversitySubject.findByIdAndUpdate(id,{name:body.name.trim(),code:body.code?.trim()||"",slug,description:body.description?.trim()||"",color:body.color||"#2563eb"},{new:true,runValidators:true}); if(!subject) return NextResponse.json({error:"Không tìm thấy môn học"},{status:404}); return NextResponse.json({subject}); }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Không thể cập nhật"},{status:400});}}
export async function DELETE(_:NextRequest,{params}:Context){ if(!(await getSession())) return NextResponse.json({error:"Chưa đăng nhập"},{status:401}); await connectMongoDB(); const {id}=await params; const subject=await UniversitySubject.findByIdAndDelete(id); if(!subject) return NextResponse.json({error:"Không tìm thấy môn học"},{status:404}); await CourseNote.deleteMany({subjectId:id}); return NextResponse.json({success:true}); }
