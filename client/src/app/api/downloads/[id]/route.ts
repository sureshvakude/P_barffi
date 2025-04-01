import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { eq } from "drizzle-orm";

// 🟢 Get Downloads by User ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // Convert userId to a number (or handle it as appropriate for your system)
    const { id } = await context.params;

    // Fetch downloads where the userId matches the parameter
    const downloads = await db
      .select()
      .from(schema.downloads)
      .where(eq(schema.downloads.userId, Number(id)));

    if (!downloads.length) {
      return NextResponse.json({ error: "No downloads found for this user" }, { status: 404 });
    }

    return NextResponse.json(downloads, { status: 200 });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 });
  }
}