import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import bcrypt from "bcrypt";
// import { eq } from "drizzle-orm";
// import { getServerSession } from "next-auth";

// 🟢 Get All Users
export async function GET() {
  try {
    const users = await db.select().from(schema.users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// 🟢 Create a New User
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await db.insert(schema.users).values({
      name: body.name,
      email: body.email,
      password: hashedPassword
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
