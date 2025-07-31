
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";



export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const pathname = url.pathname;


    const token = request.headers.get("Authorization")?.split(" ")[1];
    console.log(`Token: ${token}`);
    const verifiedToken = token && await verifyAuth(token).catch(console.error);
console.log(`Verified Token: ${verifiedToken}`);

    if (pathname.includes("/api/auth/login") && verifiedToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }


    if (
        pathname.includes("/api/auth/login") ||
        pathname.includes("/api/auth/register")
    ) {
        return NextResponse.next();
    }


    if (pathname.startsWith("/api") && !verifiedToken) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"]
};