"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {

        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        router.push("/login");
    };

    return (
        <div className="w-full bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow">
            <div className="text-lg font-bold">My App</div>
            <div className="flex gap-4">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>

                {!isAuthenticated ? (
                    <>
                        <Link href="/login" className="hover:underline">Login</Link>
                        <Link href="/register" className="hover:underline">Register</Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="hover:underline">Logout</button>
                )}
            </div>
        </div>
    );
}
