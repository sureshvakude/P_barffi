import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { downloads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// POST /api/downloads
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, projectId } = body;

    if (!userId || !projectId) {
      return NextResponse.json({ error: "Missing userId or projectId" }, { status: 400 });
    }

    const result = await db.insert(downloads).values({
      userId,
      projectId,
    });

    return NextResponse.json({ message: "Download logged", result }, { status: 201 });
  } catch (error) {
    console.error("[DOWNLOAD_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/downloads?userId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in query" }, { status: 400 });
    }

    const results = await db
      .select()
      .from(downloads)
      .where(eq(downloads.userId, Number(userId)))
      .orderBy(desc(downloads.createdAt));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("[DOWNLOAD_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
