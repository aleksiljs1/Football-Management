import prisma from "@/lib/prisma";

export async function findUserByUsername(userName: string) {
  return prisma.user.findUnique({
    where: { username: userName },
  });
}

