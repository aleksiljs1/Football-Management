import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { parseparams: string } }) {
    const { parseparams } = params;

    try {
        const body = await request.json();
        const { name, position, jerseyNumber, age, goals } = body;


        if (!name || !position || jerseyNumber == null || age == null || goals == null) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const updatedPlayer = await prisma.player.update({
            where: { id: Number(parseparams)},
            data: {
                name,
                position,
                jerseyNumber,
                age,
                goals,
            },
        });

        return NextResponse.json(updatedPlayer, { status: 200 });
    } catch (error) {
        console.error("Failed to update player:", error);
        return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
    }
}
