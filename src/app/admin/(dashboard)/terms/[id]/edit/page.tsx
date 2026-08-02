import { notFound } from "next/navigation";
import { TermForm } from "@/components/TermForm";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { termFromFirestore } from "@/lib/firestore-terms";

export default async function EditTermPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const snapshot = await getAdminFirestore().collection("terms").doc(id).get(); if (!snapshot.exists) notFound();
  const term = termFromFirestore(snapshot);
  return <section className="adminContent termEditorPage"><div className="adminTitle"><div><small>THUẬT NGỮ</small><h1>Sửa thuật ngữ</h1></div></div><TermForm term={{ _id: term._id, name: term.name, description: term.description }} /></section>;
}
