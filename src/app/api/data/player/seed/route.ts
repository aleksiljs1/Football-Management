// app/api/data/player/seed/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const dummyPlayers = [
    { name: "David De Gea", position: "Goalkeeper", jerseyNumber: 1, age: 32, goals: 0 },
    { name: "Aaron Wan-Bissaka", position: "Defender", jerseyNumber: 29, age: 25, goals: 2 },
    { name: "Raphaël Varane", position: "Defender", jerseyNumber: 19, age: 30, goals: 1 },
    { name: "Lisandro Martinez", position: "Defender", jerseyNumber: 6, age: 25, goals: 1 },
    { name: "Luke Shaw", position: "Defender", jerseyNumber: 23, age: 27, goals: 3 },
    { name: "Casemiro", position: "Midfielder", jerseyNumber: 18, age: 31, goals: 5 },
    { name: "Bruno Fernandes", position: "Midfielder", jerseyNumber: 8, age: 28, goals: 12 },
    { name: "Christian Eriksen", position: "Midfielder", jerseyNumber: 14, age: 31, goals: 3 },
    { name: "Marcus Rashford", position: "Forward", jerseyNumber: 10, age: 25, goals: 22 },
    { name: "Jadon Sancho", position: "Forward", jerseyNumber: 25, age: 23, goals: 8 },
    { name: "Anthony Martial", position: "Forward", jerseyNumber: 9, age: 27, goals: 7 },
    { name: "André Onana", position: "Goalkeeper", jerseyNumber: 24, age: 27, goals: 0 },
    { name: "Diogo Dalot", position: "Defender", jerseyNumber: 20, age: 24, goals: 1 },
    { name: "Victor Lindelöf", position: "Defender", jerseyNumber: 2, age: 28, goals: 0 },
    { name: "Harry Maguire", position: "Defender", jerseyNumber: 5, age: 30, goals: 2 },
    { name: "Tyrell Malacia", position: "Defender", jerseyNumber: 12, age: 23, goals: 0 },
    { name: "Scott McTominay", position: "Midfielder", jerseyNumber: 39, age: 26, goals: 4 },
    { name: "Mason Mount", position: "Midfielder", jerseyNumber: 7, age: 24, goals: 3 },
    { name: "Antony", position: "Forward", jerseyNumber: 21, age: 23, goals: 6 },
    { name: "Alejandro Garnacho", position: "Forward", jerseyNumber: 17, age: 19, goals: 5 },
];

export async function POST() {
    try {

        await prisma.player.deleteMany();


        await prisma.player.createMany({
            data: dummyPlayers,
        });

        return NextResponse.json({
            message: "Database seeded with 20 players",
            playerCount: dummyPlayers.length
        });
    } catch (error) {
        console.error("Error seeding player data:", error);
        return NextResponse.json(
            { error: "Failed to seed player data" },
            { status: 500 }
        );
    }
}