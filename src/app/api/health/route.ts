import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const database = await connectMongoDB();
    await database.connection.db?.admin().ping();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("MongoDB health check failed:", error);
    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 503 },
    );
  }
}
