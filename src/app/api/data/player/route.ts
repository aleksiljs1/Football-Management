import { NextResponse } from "next/server";
import { PlayerTable } from "@/app/api/service/player/get/get-all-players";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const query = searchParams.get("query") || "";

    const playerTable = new PlayerTable();

    try {
        const result = await playerTable.getPlayerTable(page, pageSize, query);
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
