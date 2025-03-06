import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { projects } from "@/db/schema";

export async function GET(req: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await context.params; // ✅ Await params

    const projectIdNumber = Number(projectId); // Convert to a number
    if (isNaN(projectIdNumber)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Fetch project using Drizzle ORM
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectIdNumber))
      .limit(1);

    if (!project.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project[0], { status: 200 });

  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// ✅ Adding PATCH method to update a project
export async function PATCH(req: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await context.params; // ✅ Await params

    const projectIdNumber = Number(projectId);
    if (isNaN(projectIdNumber)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await req.json();

    // Ensure the request body has at least one field to update
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No update data provided" }, { status: 400 });
    }

    // Update the project using Drizzle ORM
    await db
      .update(projects)
      .set(body)
      .where(eq(projects.id, projectIdNumber));

    return NextResponse.json({ message: "Project updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}