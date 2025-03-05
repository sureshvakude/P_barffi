import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db/db";
import { projects } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? parseInt(session.user.id) : 0; // ✅ Avoid `null`

    const { name = "Untitled project", json = "", width = 900, height = 1200 } = await req.json();

    if (!name || !width || !height) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // ✅ Use `$returningId()` for MySQL to return the inserted project's ID
    const newProjectId = await db
      .insert(projects)
      .values({
        userId, // ✅ Will be `undefined` if not authenticated
        name,
        height,
        width,
        json,
        userType: session?.user?.userType ?? "guest",
      })
      .$returningId(); // ✅ MySQL-specific return statement

    return NextResponse.json(
      { message: "Project created successfully", projectId: newProjectId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
