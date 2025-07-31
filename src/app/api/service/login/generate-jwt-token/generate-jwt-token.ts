import { SignJWT } from "jose";

import prisma from "@/lib/prisma";

export async function generateJwtToken(id: number) {

  const user = await prisma.user.findUnique({
    where: { id },
     });

  if (!user) {
    throw new Error("User not found");
  }
  return new SignJWT({
    id
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.SECRET_KEY));
}