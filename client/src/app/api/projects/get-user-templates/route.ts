import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions for getServerSession

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id); // Convert user ID to a number

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userTemplates = await db.query.projects.findMany({
      where: (project, { and, eq }) =>
        and(eq(project.userId, userId), eq(project.isTemplate, true)),
    });

    return NextResponse.json(userTemplates, { status: 200 });
  } catch (error) {
    console.error("Error fetching user templates:", error);
    return NextResponse.json({ error: "Failed to fetch user templates" }, { status: 500 });
  }
}
