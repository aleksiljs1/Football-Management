// app/api/service/player/get/get-all-players.ts
import prisma from "@/lib/prisma";

export class PlayerTable {
    async getPlayerTable(page: number, pageSize: number, query: string, position?: string) {
        // Create base where clause
        const whereClause: any = {
            OR: query
                ? [
                    { name: { contains: query, mode: "insensitive" } },
                    { position: { contains: query, mode: "insensitive" } }
                ]
                : undefined,
        };

        // Add position filter if provided
        if (position) {
            whereClause.position = position;
        }

        // Remove undefined properties
        Object.keys(whereClause).forEach(key => whereClause[key] === undefined && delete whereClause[key]);

        const players = await prisma.player.findMany({
            where: whereClause,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { id: "asc" },
        });

        const totalPlayers = await prisma.player.count({ where: whereClause });

        // Calculate total goals
        const totalGoalsResult = await prisma.player.aggregate({
            where: whereClause,
            _sum: { goals: true }
        });
        const totalGoals = totalGoalsResult._sum.goals || 0;

        // Get position counts
        const positionCounts = {
            Goalkeeper: await prisma.player.count({
                where: { ...whereClause, position: "Goalkeeper" }
            }),
            Defender: await prisma.player.count({
                where: { ...whereClause, position: "Defender" }
            }),
            Midfielder: await prisma.player.count({
                where: { ...whereClause, position: "Midfielder" }
            }),
            Forward: await prisma.player.count({
                where: { ...whereClause, position: "Forward" }
            })
        };

        return {
            players,
            totalPages: Math.ceil(totalPlayers / pageSize),
            currentPage: page,
            totalPlayers,
            totalGoals,
            positionCounts
        };
    }
}