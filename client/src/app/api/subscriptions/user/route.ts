import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userSubscription = await db.query.subscriptions.findFirst({
            where: (sub, { eq }) => eq(sub.userId, Number(session.user.id)),
        });

        return NextResponse.json(userSubscription, { status: 200 });
    } catch (error) {
        console.error("Error fetching user subscription:", error);
        return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
    }
}

