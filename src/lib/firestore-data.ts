import type { DocumentData, QueryDocumentSnapshot, DocumentSnapshot, Timestamp } from "firebase-admin/firestore";

export type FirestoreArticle = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  level: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function asDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value && typeof value === "object" && "toDate" in value) return (value as Timestamp).toDate();
  const parsed = value ? new Date(String(value)) : new Date(0);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

export function articleFromFirestore(snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): FirestoreArticle {
  const data = snapshot.data() ?? {};
  return {
    _id: snapshot.id,
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    summary: String(data.summary ?? ""),
    content: String(data.content ?? ""),
    coverImage: String(data.coverImage ?? ""),
    category: String(data.category ?? "Cơ bản"),
    level: String(data.level ?? "Nhập môn"),
    published: Boolean(data.published),
    createdAt: asDate(data.createdAt),
    updatedAt: asDate(data.updatedAt),
  };
}

export function articleToJson(article: FirestoreArticle) {
  return { ...article, createdAt: article.createdAt.toISOString(), updatedAt: article.updatedAt.toISOString() };
}

export function sortArticlesNewestFirst(articles: FirestoreArticle[]) {
  return articles.sort((first, second) => second.createdAt.getTime() - first.createdAt.getTime());
}
