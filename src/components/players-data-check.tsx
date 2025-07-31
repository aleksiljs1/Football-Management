"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {axiosInstance} from "@/axios";

export default function PlayerDataCheck({ children }: { children: ReactNode }) {
    const [hasPlayers, setHasPlayers] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [seeding, setSeeding] = useState<boolean>(false);
    const router = useRouter();

    const handleDataSeed = async () => {
        try {
            setSeeding(true);
            await axios.post("/api/data/player/seed");
            router.refresh();
        } catch (error) {
            console.error("Seeding failed", error);
        } finally {
            setSeeding(false);
        }
    };

    useEffect(() => {
        const checkForPlayers = async () => {
            try {
                const response = await axiosInstance.get("/api/data/player/check");
                setHasPlayers(response.data.hasPlayers);
            } catch (error) {
                console.error("Error checking player data:", error);
                setHasPlayers(false);
            } finally {
                setLoading(false);
            }
        };

        checkForPlayers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
                    <p className="text-gray-700 text-lg font-medium">Checking player database...</p>
                </div>
            </div>
        );
    }

    if (!hasPlayers) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white/20 p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No Players Found</h2>
                        <p className="opacity-90">Your team roster is empty. Let's add some players!</p>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose how you'd like to proceed:</h3>

                            <div className="space-y-4">
                                <a
                                    href="/players/add"
                                    className="block w-full py-3 px-4 text-center font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Players Manually
                                    </div>
                                </a>

                                <button
                                    onClick={handleDataSeed}
                                    disabled={seeding}
                                    className="w-full py-3 px-4 text-center font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-center">
                                        {seeding ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Seeding Database...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                                Seed With Dummy Players
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500 mt-8">
                            <p>Dummy data includes 20 players with realistic stats for all positions</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}