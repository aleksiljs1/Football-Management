
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";


interface PlayerState {
    name: string;
    position: string;
    jerseyNumber: string;
    age: string;
    goals: string;
}

const EditPlayer = () => {
    const { parseparams } = useParams()
    const router = useRouter();

    const [player, setPlayer] = useState<PlayerState>({
        name: "",
        position: "",
        jerseyNumber: "",
        age: "",
        goals: ""
    });

    useEffect(() => {
        alert(parseparams)
        axios
            .get(`/api/data/player/edit/get/${parseparams}`)
            .then((response) => {
                const playerData = response.data;
                setPlayer({
                    name: playerData.name,
                    position: playerData.position,
                    jerseyNumber: playerData.jerseyNumber.toString(),
                    age: playerData.age.toString(),
                    goals: playerData.goals.toString()
                });
            })
            .catch((error) => {
                console.error("Error fetching player data:", error);
                toast.error("Failed to load player data");
            });
    }, [parseparams]);

    // abit tricky but saves me the trouble of doing each one. one by one
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPlayer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateInputs = () => {
        // i needed to basically convert them to numbers if i whanted to use them
        const jerseyNum = Number(player.jerseyNumber);
        const ageNum = Number(player.age);
        const goalsNum = Number(player.goals);

        if (!player.name || !player.position || !player.jerseyNumber ||
            !player.age || !player.goals) {
            toast.error("All fields are required.");
            return false;
        }

        if (isNaN(jerseyNum) || jerseyNum < 1 || jerseyNum > 99) {
            toast.error("Jersey number must be between 1 and 99");
            return false;
        }

        if (isNaN(ageNum) || ageNum < 16 || ageNum > 99) {
            toast.error("Age must be between 16 and 99");
            return false;
        }

        if (isNaN(goalsNum) || goalsNum < 0) {
            toast.error("Goals scored must be 0 or a positive number");
            return false;
        }

        return true;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateInputs()) return;

        const confirmSubmission = window.confirm("Are you sure you want to update this player?");
        if (!confirmSubmission) return;

        axios
            .put(`/api/data/player/edit/put/${parseparams}`, {
                name: player.name,
                position: player.position,
                jerseyNumber: parseInt(player.jerseyNumber),
                age: parseInt(player.age),
                goals: parseInt(player.goals)
            })
            .then(() => {
                toast.success("Player updated successfully!");
                router.push("/dashboard");
            })
            .catch((error) => {
                console.error("Error updating player:", error);
                toast.error("Failed to update player");
            });
    };

    return (
        <>
            <ToastContainer />
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col justify-center p-8 md:p-14 w-full max-w-md">
                    <h2 className="text-4xl font-bold text-violet-800 mb-3">
                        Edit Player
                    </h2>
                    <p className="font-light text-gray-500 mb-8">Update player details</p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="name" className="mb-1 text-gray-700 font-medium">
                                Player Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={player.name}
                                placeholder="Player name"
                                className="w-full p-3 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label htmlFor="position" className="mb-1 text-gray-700 font-medium">
                                Position
                            </label>
                            <select
                                name="position"
                                className="w-full p-3 border text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={player.position}
                                onChange={handleChange}
                            >
                                <option value="">Select position</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                                <option value="Defender">Defender</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Forward">Forward</option>
                            </select>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label htmlFor="jerseyNumber" className="mb-1 text-gray-700 font-medium">
                                Jersey Number
                            </label>
                            <input
                                type="number"
                                name="jerseyNumber"
                                value={player.jerseyNumber}
                                placeholder="1-99"
                                min="1"
                                max="99"
                                className="w-full p-3 border text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label htmlFor="age" className="mb-1 text-gray-700 font-medium">
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={player.age}
                                placeholder="16-45"
                                min="16"
                                max="45"
                                className="w-full p-3 border text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col mb-6">
                            <label htmlFor="goals" className="mb-1 text-gray-700 font-medium">
                                Goals Scored
                            </label>
                            <input
                                type="number"
                                name="goals"
                                value={player.goals}
                                placeholder="Goals scored"
                                min="0"
                                className="w-full p-3 border text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-violet-600 text-white font-bold rounded-md hover:bg-violet-700 transition"
                        >
                            Update Player
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditPlayer;