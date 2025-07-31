import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/app/api/service/register/find-user-by-email";
import { createUser } from "@/app/api/service/register/create-user";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        const { userName, password } = await request.json();


        const existingUser = await findUserByEmail(userName);
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }


        const hashedPassword = await  bcrypt.hash(password, 10);;


        const newUser = await createUser(userName, hashedPassword);

        return NextResponse.json({
            success: true,
            message: "Registration successful",
            userId: newUser.id,
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
