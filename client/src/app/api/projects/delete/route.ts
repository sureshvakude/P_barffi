import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm"; // ✅ Import eq() for filtering

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Ensure `id` exists in the request
    if (!body.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Perform the delete operation
    await db.delete(schema.projects).where(eq(schema.projects.id, body.id)); // ✅ Correct method

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
