import { jwtVerify } from "jose";

interface UserJwtPayload {
    id: number;
    iat: number;
    exp: number;
}

const getJwtSecretKey = () => {
    const secret = process.env.SECRET_KEY;
    if (!secret) {
        console.error("SECRET_KEY is not set in environment variables");
        throw new Error("SECRET_KEY is not set");
    }
    return new TextEncoder().encode(secret);
};

export const verifyAuth = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        return payload as unknown as UserJwtPayload;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Invalid or expired token");
    }
};