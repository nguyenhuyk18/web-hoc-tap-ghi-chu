import { notFound } from "next/navigation";
import { SpecialtyForm } from "@/components/SpecialtyForm";
import { connectMongoDB } from "@/lib/mongodb";
import { Specialty } from "@/models/Specialty";

export default async function EditSpecialtyPage({ params }: { params: Promise<{ id: string }> }) {
  await connectMongoDB(); const { id } = await params; const specialty = await Specialty.findById(id).lean(); if (!specialty) notFound();
  return <section className="adminContent termEditorPage"><div className="adminTitle"><div><small>CHUYÊN NGÀNH</small><h1>Sửa chuyên ngành</h1></div></div><SpecialtyForm specialty={JSON.parse(JSON.stringify(specialty))} /></section>;
}
