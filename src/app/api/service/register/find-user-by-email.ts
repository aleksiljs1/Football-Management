import prisma from "@/lib/prisma";

export async function findUserByEmail(username : string) {
    return await prisma.user.findUnique({
        where: { username },
    });
}
