import prisma from "@/lib/prisma";


export class CreatePlayer {
    async createPlayer(
        playerName: string,
        position: string,
        jerseyNumber: number,
        age: number,
        goals: number
    ) {
console.log(playerName);
console.log(position);
console.log(jerseyNumber);
console.log(age);
        const existing = await prisma.player.findFirst({
            where: { jerseyNumber },
        });

        if (existing) {
            throw new Error("Jersey number already in use.");
        }

        return await prisma.player.create({
            data: {
                name: playerName,
                position,
                jerseyNumber,
                age,
                goals,
            },
        });
    }
}
