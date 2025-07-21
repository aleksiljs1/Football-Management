import prisma from "@/lib/prisma";

export class DeletePlayer {
  async deletePlayer(id: string) {
    return await prisma.player.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
