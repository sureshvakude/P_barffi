import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";

export async function GET() {
  try {
    const templates = await db.query.projects.findMany({
      where: (project, { eq }) => eq(project.isTemplate, true),
    });

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}
