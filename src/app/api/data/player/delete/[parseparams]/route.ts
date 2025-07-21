import { NextResponse } from "next/server";
import {DeletePlayer} from "@/app/api/service/player/delete/delete-player";


export async function DELETE(request: Request, { params }: { params: { parseparams: string } }) {
  try {
    const { parseparams } = params;
    const PlayerId = new DeletePlayer();
    const deletedStudent = await  PlayerId.deletePlayer(parseparams);

    return NextResponse.json(
      { message: "Student deleted successfully!", student: deletedStudent },
      { status: 201 },
    );

  } catch (error) {
    NextResponse.json({ message: "Something went wrong!", error: error }, {status: 500});
  }
}
