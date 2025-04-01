import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { eq } from "drizzle-orm";

// 🟢 Get a Single User
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ Ensure params is awaited properly
    const user = await db.select().from(schema.users).where(eq(schema.users.id, Number(id)));

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// 🟢 Update a User
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    await db.update(schema.users)
      .set(body)
      .where(eq(schema.users.id, Number(id)));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// 🟢 Delete a User
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ Await params to resolve properly
    await db.delete(schema.users).where(eq(schema.users.id, Number(id)));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
