import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    // Ensure userId is correctly typed
    const userId = Number(session.user.id);
    
    // Correctly use `eq` with `where`
    await db.delete(schema.subscriptions).where(
      and(eq(schema.subscriptions.id, body.subscriptionId), eq(schema.subscriptions.userId, userId))
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
