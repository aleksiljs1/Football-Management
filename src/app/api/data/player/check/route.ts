import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const playerCount = await prisma.player.count();
        return NextResponse.json({ hasPlayers: playerCount > 0 });
    } catch (error) {
        console.error("Error checking player data:", error);
        return NextResponse.json(
            { error: "Failed to check player data" },
            { status: 500 }
        );
    }
}