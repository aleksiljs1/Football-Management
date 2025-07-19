import { NextResponse } from "next/server";
import {CreatePlayer} from "@/app/api/service/player/add/create-player";


export async function POST(request: Request) {
    try {
        const { playerName, position, jerseyNumber, age, goals } = await request.json();

        const createPlayer = new CreatePlayer();
        console.log(playerName)
        const newPlayer = await createPlayer.createPlayer(
            playerName,
            position,
            jerseyNumber,
            age,
            goals
        );
        console.log(newPlayer);

        return NextResponse.json(
            { message: "Player added successfully!", player: newPlayer },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error adding player", error },
            { status: 500 }
        );
    }
}
