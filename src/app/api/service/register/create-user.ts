import prisma from "@/lib/prisma";

export async function createUser(username: string, hashedPassword: string) {
    return await prisma.user.create({
        data: {
            username,
            password: hashedPassword,

        },
    });
}
