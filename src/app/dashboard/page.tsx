"use client";

import Search from "@/components/search";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function Dashboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchPlayers = async (query = "", page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/data/player/get?query=${query}&page=${page}`);

            console.log("Players response:", response.data);
// note to self. find a better way to do this tmrow
            if (Array.isArray(response.data.players)) {
                setPlayers(response.data.players);
                setTotalPages(response.data.totalPages || 1);
                setCurrentPage(response.data.currentPage || 1);
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

    const handleSearch = (searchText: string) => {
        setQuery(searchText);
        router.push(`?query=${searchText}&page=1`);
    };

    const handlePageChange = (page: number) => {
        router.push(`?query=${query}&page=${page}`);
    };

    useEffect(() => {
        const currentQuery = searchParams.get("query") || "";
        const currentPage = parseInt(searchParams.get("page") || "1", 10);

        setQuery(currentQuery);
        setCurrentPage(currentPage);

        fetchPlayers(currentQuery, currentPage);
    }, [searchParams]);

    return (
        <>
            <ToastContainer />
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-violet-800 mb-6">Player Management</h1>

                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                        <Search placeholder="Search players..." onSearch={handleSearch} initialValue={query} />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-800"></div>
                        </div>
                    ) : (
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
                                    {players.map((player, index) => (
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
                    )}


                    <div className="mt-4 flex justify-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`px-4 py-2 rounded ${
                                    currentPage === i + 1
                                        ? "bg-violet-700 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
