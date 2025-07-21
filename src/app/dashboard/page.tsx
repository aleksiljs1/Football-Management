"use client";

import Search from "@/components/search";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function Dashboard() {
    const [players, setPlayers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();


    const currentPage = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';

    useEffect(() => {
        fetchPlayers(currentPage, query);
    }, [currentPage, query]);

    const fetchPlayers = async (page: number, search: string) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/data/player/get?page=${page}&query=${search}`
            );

            if (Array.isArray(response.data.players)) {
                setPlayers(response.data.players);
                setTotalPages(response.data.totalPages || 1);
            } else {
                setPlayers([]);
                console.error("Invalid response format.");
            }
        } catch (error) {
            console.error("Error fetching players:", error);
            setPlayers([]);
        } finally {
            setLoading(false);
        }
    };


    const handlePagination = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <>
            <ToastContainer />
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-violet-800 mb-6">Player Management</h1>

                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                        {/* Remove onSearch and initialValue props to match student table */}
                        <Search placeholder="Search players..." />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-800"></div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="bg-violet-800 text-white">
                                            <th className="px-4 py-3 text-left">ID</th>
                                            <th className="px-4 py-3 text-left">Name</th>
                                            <th className="px-4 py-3 text-left">Position</th>
                                            <th className="px-4 py-3 text-left">Jersey Number</th>
                                            <th className="px-4 py-3 text-left">Age</th>
                                            <th className="px-4 py-3 text-left">Goals</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {players.map((player: any, index: number) => (
                                            <tr key={player.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-4 py-3 text-sm text-gray-700">{player.id}</td>
                                                <td className="px-4 py-3 font-medium text-gray-900">{player.name}</td>
                                                <td className="px-4 py-3 text-gray-700">{player.position}</td>
                                                <td className="px-4 py-3 text-gray-700">{player.jerseyNumber}</td>
                                                <td className="px-4 py-3 text-gray-700">{player.age}</td>
                                                <td className="px-4 py-3 text-gray-700">{player.goals}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>


                            <div className="flex justify-center mt-4 gap-2">
                                <button
                                    onClick={() => handlePagination(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                                <button
                                    onClick={() => handlePagination(Math.min(currentPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}