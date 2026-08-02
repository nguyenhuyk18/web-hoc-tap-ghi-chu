import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export async function GET() {
  try {
    await getAdminFirestore().collection("_health").limit(1).get();

    return NextResponse.json({
      status: "ok",
      database: "firestore",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Firestore health check failed:", error);
    return NextResponse.json(
      { status: "error", database: "firestore-disconnected" },
      { status: 503 },
    );
  }
}
