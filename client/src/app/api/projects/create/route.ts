import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let userId: number = 0; // Default to 0 for guests
    let userType = "guest"; // Default type for guests

    if (session && session.user) {
      userId = Number(session.user.id);
      if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      userType = session.user.userType || "user";
    }

    const body = await req.json();
    const newProject = await db.insert(schema.projects).values({
      userId,
      name: body.name,
      height: body.height,
      width: body.width,
      thumbnail: body.thumbnail,
      json: body.json,
      userType: session.user.userType || "user",
      isPro: body.isPro ?? false,
      prize: body.prize ?? 0,
      isTemplate: body.isTemplate ?? false,
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
