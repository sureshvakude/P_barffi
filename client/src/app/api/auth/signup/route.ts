import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db, schema } from "@/db/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validation for required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const newUser = await db.insert(schema.users).values({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}