import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// 🟢 Get a Single Download by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session || session.user.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const download = await db.select().from(schema.downloads).where(eq(schema.downloads.id, Number(params.id)));

    if (!download.length) {
      return NextResponse.json({ error: "Download not found" }, { status: 404 });
    }

    return NextResponse.json(download[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching download:", error);
    return NextResponse.json({ error: "Failed to fetch download" }, { status: 500 });
  }
}

// 🟢 Delete a Download Record
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session || session.user.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(schema.downloads).where(eq(schema.downloads.id, Number(params.id)));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting download:", error);
    return NextResponse.json({ error: "Failed to delete download" }, { status: 500 });
  }
}
