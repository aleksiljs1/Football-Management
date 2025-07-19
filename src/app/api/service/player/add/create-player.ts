import prisma from "@/lib/prisma";


export class CreatePlayer {
    async createPlayer(
        playerName: string,
        position: string,
        jerseyNumber: number,
        age: number,
        goals: number
    ) {
        // Validate uniqueness
        const existing = await prisma.player.findFirst({
            where: { jerseyNumber },
        });

        if (existing) {
            throw new Error("Jersey number already in use.");
        }

        const newPlayer = await prisma.player.create({
            data: {
                name: playerName,
                position,
                jerseyNumber,
                age,
                goals,
            },
        });

        return newPlayer;
    }
}
