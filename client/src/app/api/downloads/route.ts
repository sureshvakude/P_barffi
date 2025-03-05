import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// 🟢 Get All Downloads (Admin Only)
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const downloads = await db.select().from(schema.downloads);
    return NextResponse.json(downloads, { status: 200 });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 });
  }
}

// 🟢 Create a New Download Record
export async function POST(req: Request) {
    try {
      const session = await getServerSession();
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const body = await req.json();
  
      if (!body.projectId) {
        return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
      }
  
      const newDownload = await db.insert(schema.downloads).values({
        userId: Number(session.user.id), // 🔹 Convert userId to number
        projectId: Number(body.projectId), // 🔹 Ensure projectId is also a number
      });
  
      return NextResponse.json({ success: true, download: newDownload }, { status: 201 });
    } catch (error) {
      console.error("Error creating download:", error);
      return NextResponse.json({ error: "Failed to create download" }, { status: 500 });
    }
  }
  
