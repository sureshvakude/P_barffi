import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { eq } from "drizzle-orm"; // Import the correct equality operator
import { projects } from "@/db/schema"; // Ensure schema is imported correctly

export async function GET(req: Request, context: { params: { projectId: string } }) {
  try {
    const { params } = context;
    const projectId = Number(await params.projectId);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Fetch project using Drizzle ORM correctly
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1); // Limit to 1 result since we're fetching a single project

    if (!project.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project[0], { status: 200 });

  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
