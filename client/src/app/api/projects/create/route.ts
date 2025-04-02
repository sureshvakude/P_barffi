import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db/db";
import { projects } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? parseInt(session.user.id) : 0;

    const body = await req.json();

    const name = body?.name?.trim() || "Untitled project";
    const width = typeof body?.width === "number" ? body.width : 900;
    const height = typeof body?.height === "number" ? body.height : 1200;
    const thumbnail = body?.thumbnail ?? null;
    const isPro = Boolean(body?.isPro);
    const prize = body?.prize !== undefined ? Number(body.prize) : null;
    const isTemplate = Boolean(body?.isTemplate);
    const userType = session?.user?.userType ?? "guest";

    // Validate JSON field
    let json;
    try {
      json = JSON.stringify(body?.json ?? "");
    } catch (error) {
      return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    // Ensure required fields exist
    if (!name || !json || !width || !height) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Insert project into the database
    const newProjectId = await db
      .insert(projects)
      .values({
        userId,
        name,
        height,
        width,
        thumbnail,
        json,
        userType,
        isPro,
        prize,
        isTemplate,
      })
      .$returningId();

    return NextResponse.json(
      { message: "Project created successfully", projectId:newProjectId[0].id },
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
