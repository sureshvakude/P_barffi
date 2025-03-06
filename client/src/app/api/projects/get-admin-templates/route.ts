import { NextResponse } from "next/server";
import { db } from "@/db/db";

export async function GET() {
  try {
    const adminTemplates = await db.query.projects.findMany({
      where: (project, { and, eq }) => and(eq(project.userType, "admin"), eq(project.isTemplate, true)),
    });

    return NextResponse.json(adminTemplates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin templates" }, { status: 500 });
  }
}
