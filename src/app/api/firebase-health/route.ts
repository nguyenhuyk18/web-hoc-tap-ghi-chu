import { NextResponse } from "next/server";
import { getAdminFirestore, getFirebaseAdminApp } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const firestore = getAdminFirestore();
    const [articles, terms, admins] = await Promise.all([
      firestore.collection("articles").count().get(),
      firestore.collection("terms").count().get(),
      firestore.collection("admins").count().get(),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "firestore",
      projectId: getFirebaseAdminApp().options.projectId,
      collections: {
        articles: articles.data().count,
        terms: terms.data().count,
        admins: admins.data().count,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Firebase health check failed:", error);
    return NextResponse.json(
      { status: "error", database: "firestore", message: error instanceof Error ? error.message : "Không thể kết nối Firebase" },
      { status: 503 },
    );
  }
}
