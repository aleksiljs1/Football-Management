import { NextResponse } from "next/server";

import {generateJwtToken} from "@/app/api/service/login/generate-jwt-token/generate-jwt-token";
import {findUserByUsername} from "@/app/api/service/login/find-user-by-username/find-user-by-username";
import {validatePassword} from "@/app/api/service/login/validate-password/validate-password";


export async function POST(request: Request) {
    try {
        const { userName, password } = await request.json();


        const user = await findUserByUsername(userName);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }


        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }


        const token = await generateJwtToken(user.id);

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}