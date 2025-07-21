import prisma from "@/lib/prisma";

export class PlayerTable {
    async getPlayerTable(page: number, pageSize: number, query: string) {
        const whereClause = query
            ? {
                OR: [
                    {name: {
                            contains: query,
                        },
                    },
                    {
                        position: {
                            contains: query,
                        },
                    },
                ],
            }
            : {};

        const players = await prisma.player.findMany({
            where: whereClause,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { id: "asc" },
        });

        const totalPlayers = await prisma.player.count({ where: whereClause });

        return {
            players,
            totalPages: Math.ceil(totalPlayers / pageSize),
            currentPage: page,
        };
    }
}
