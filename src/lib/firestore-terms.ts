import type { DocumentData, QueryDocumentSnapshot, DocumentSnapshot, Timestamp } from "firebase-admin/firestore";

export type FirestoreTerm = {
  _id: string;
  name: string;
  description: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};

export function termFromFirestore(snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): FirestoreTerm {
  const data = snapshot.data() ?? {};
  return {
    _id: snapshot.id,
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function sortTerms(terms: FirestoreTerm[]) {
  return terms.sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
}
