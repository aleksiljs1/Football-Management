"use client";

import Search from "@/components/search";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import PlayerDataCheck from "@/components/players-data-check";
import {axiosInstance} from "@/axios";
import Header from "@/components/header";

export default function Dashboard() {
    const [players, setPlayers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [squadStats, setSquadStats] = useState({
        totalPlayers: 0,
        totalGoals: 0,
        positionCounts: {
            Goalkeeper: 0,
            Defender: 0,
            Midfielder: 0,
            Forward: 0
        }
    });

    const searchParams = useSearchParams();
    const router = useRouter();

    const currentPage = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('query') || '';
    const positionFilter = searchParams.get('position') || '';

    useEffect(() => {
        fetchPlayers(currentPage, query, positionFilter);
    }, [currentPage, query, positionFilter]);

    const fetchPlayers = async (page: number, search: string, position: string) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/api/data/player/get?page=${page}&query=${search}&position=${position}`
            );

            if (Array.isArray(response.data.players)) {
                setPlayers(response.data.players);
                setTotalPages(response.data.totalPages || 1);

                //will find a smarter way to do this , basically update squad statistics
                setSquadStats({
                    totalPlayers: response.data.totalPlayers || 0,
                    totalGoals: response.data.totalGoals || 0,
                    positionCounts: response.data.positionCounts || {
                        Goalkeeper: 0,
                        Defender: 0,
                        Midfielder: 0,
                        Forward: 0
                    }
                });
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

    const handlePositionFilter = (position: string) => {
        const params = new URLSearchParams(searchParams);

        if (position) {
            params.set('position', position);
        } else {
            params.delete('position');
        }

        // logically will need to go page one when changing filters
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handlePlayerDelete = async (playerId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this player?");
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/api/data/player/delete/${playerId}`);
            toast.success("Player deleted successfully");
            fetchPlayers(currentPage, query, positionFilter);
        } catch (error) {
            console.error("Error deleting player:", error);
            toast.error("Failed to delete player");
        }
    };

    const handlePlayerEdit = (playerId: string) => {
        router.push(`/player/edit/${playerId}`);
    };

    return (
        <>
            <ToastContainer />
            <Header/>
            <PlayerDataCheck>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-violet-800 mb-6">Player Management</h1>

                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-600">Squad Size</div>
                            <div className="text-3xl font-bold text-violet-700">{squadStats.totalPlayers}</div>
                            <div className="text-sm text-gray-500">Total Players</div>
                        </div>

                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-600">Total Goals</div>
                            <div className="text-3xl font-bold text-green-600">{squadStats.totalGoals}</div>
                            <div className="text-sm text-gray-500">Team Goals Scored</div>
                        </div>

                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-600">Active Filter</div>
                            <div className="text-xl font-bold text-blue-600">
                                {positionFilter || "All Positions"}
                            </div>
                            <div className="text-sm text-gray-500">Currently Showing</div>
                        </div>
                    </div>


                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Search placeholder="Search players..." />
                        </div>

                        <div className="w-full md:w-auto">
                            <label htmlFor="position-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Position
                            </label>
                            <select
                                id="position-filter"
                                className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={positionFilter}
                                onChange={(e) => handlePositionFilter(e.target.value)}
                            >
                                <option value="">All Positions</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                                <option value="Defender">Defender</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Forward">Forward</option>
                            </select>
                        </div>
                    </div>


                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Position Distribution</h2>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(squadStats.positionCounts).map(([position, count]) => (
                                <div
                                    key={position}
                                    className={`p-3 rounded-lg text-center ${
                                        positionFilter === position ? 'bg-violet-100 border-2 border-violet-500' : 'bg-gray-100'
                                    }`}
                                >
                                    <div className="text-sm font-medium text-gray-600">{position}</div>
                                    <div className="text-xl font-bold text-violet-700">{count}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-800"></div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="bg-violet-800 text-white">
                                            <th className="px-4 py-3 text-left">ID</th>
                                            <th className="px-4 py-3 text-left">Name</th>
                                            <th className="px-4 py-3 text-left">Position</th>
                                            <th className="px-4 py-3 text-left">Jersey</th>
                                            <th className="px-4 py-3 text-left">Age</th>
                                            <th className="px-4 py-3 text-left">Goals</th>
                                            <th className="px-4 py-3 text-left">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {players.map((player: any, index: number) => (
                                            <tr key={player.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-4 py-3 text-sm text-gray-700">{player.id}</td>
                                                <td className="px-4 py-3 font-medium text-gray-900">{player.name}</td>
                                                <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                player.position === 'Goalkeeper' ? 'bg-blue-100 text-blue-800' :
                                    player.position === 'Defender' ? 'bg-green-100 text-green-800' :
                                        player.position === 'Midfielder' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                            }`}>
                              {player.position}
                            </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                              #{player.jerseyNumber}
                            </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{player.age}</td>
                                                <td className="px-4 py-3 text-gray-700">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                              {player.goals}
                            </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handlePlayerEdit(player.id)}
                                                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition text-sm flex items-center"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handlePlayerDelete(player.id)}
                                                            className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition text-sm flex items-center"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
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
                </PlayerDataCheck>
        </>
    );
}