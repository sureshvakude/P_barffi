import { NextResponse } from "next/server";
import { db, schema } from "@/db/db";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || session.user.userType !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const subscriptions = await db.select().from(schema.subscriptions);
        return NextResponse.json(subscriptions, { status: 200 });
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        if (!body.price || !body.currentPeriodEnd) {
            return NextResponse.json({ error: "Price and currentPeriodEnd are required" }, { status: 400 });
        }

        const newSubscription = await db.insert(schema.subscriptions).values({
            userId: Number(session.user.id), // Ensure userId is a number
            status: "active",
            price: Number(body.price), // Convert price to a number
            currentPeriodEnd: new Date(body.currentPeriodEnd), // Ensure date format is correct
        });

        return NextResponse.json({ success: true, subscription: newSubscription }, { status: 201 });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }
}


