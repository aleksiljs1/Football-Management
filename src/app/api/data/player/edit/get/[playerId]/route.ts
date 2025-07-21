import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { playerId: string } }) {
    const { playerId } = params;

    try {
        const player = await prisma.player.findUnique({
            where: { id: Number(playerId) },
        });

        if (!player) {
            return NextResponse.json(
                { error: "Player not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(player);
    } catch (error) {
        console.error("Error fetching player:", error);
        return NextResponse.json(
            { error: "Failed to fetch player data" },
            { status: 500 }
        );
    }
}