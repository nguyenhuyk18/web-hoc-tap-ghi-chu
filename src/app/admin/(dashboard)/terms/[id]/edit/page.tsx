import { notFound } from "next/navigation";
import { TermForm } from "@/components/TermForm";
import { connectMongoDB } from "@/lib/mongodb";
import { Term } from "@/models/Term";

export default async function EditTermPage({ params }: { params: Promise<{ id: string }> }) {
  await connectMongoDB(); const { id } = await params; const term = await Term.findById(id).lean(); if (!term) notFound();
  return <section className="adminContent termEditorPage"><div className="adminTitle"><div><small>THUẬT NGỮ</small><h1>Sửa thuật ngữ</h1></div></div><TermForm term={JSON.parse(JSON.stringify(term))} /></section>;
}
