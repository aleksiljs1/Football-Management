"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

const AddPlayer = () => {
    const [playerName, setPlayerName] = useState("");
    const [position, setPosition] = useState("");
    const [jerseyNumber, setJerseyNumber] = useState<number | "">("");
    const [age, setAge] = useState<number | "">("");
    const [goals, setGoals] = useState<number | "">("");
    const router = useRouter();

    const validateInputs = async () => {
        if (!playerName.trim()) {
            toast.error("Player name cannot be empty.");
            return false;
        }
        if (!position) {
            toast.error("Position is required.");
            return false;
        }
        if (jerseyNumber === "" || jerseyNumber < 1 || jerseyNumber > 99) {
            toast.error("Jersey number must be between 1 and 99.");
            return false;
        }
        if (age === "" || age < 16 || age > 45) {
            toast.error("Age must be between 16 and 45.");
            return false;
        }
        if (goals === "" || goals < 0) {
            toast.error("Goals scored must be 0 or a positive number.");
            return false;
        }

// will prolly do this in endpoint no need here
        // try {
        //     const res = await axios.get(`/api/players/check-jersey/${jerseyNumber}`);
        //     if (!res.data.available) {
        //         toast.error("Jersey number is already taken.");
        //         return false;
        //     }
        // } catch (error) {
        //     toast.error("Error validating jersey number uniqueness.");
        //     return false;
        // }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!(await validateInputs())) return;

        try {
            await axios.post("/api/data/player/add", {
                playerName,
                position,
                jerseyNumber,
                age,
                goals,
            });
            toast.success("Player added successfully!");
            router.push("/players");
        } catch (error) {
            toast.error("Error adding player.");
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="flex flex-col justify-center p-8 md:p-14">
                <h2 className="text-4xl font-bold text-violet-800 mb-3">Add Player</h2>
                <p className="font-light text-gray-500 mb-8">Create new players with:</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="playerName" className="mb-1 text-gray-700 font-medium">
                            Player Name
                        </label>
                        <input
                            type="text"
                            id="playerName"
                            placeholder="Player name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            onChange={(e) => setPlayerName(e.target.value)}
                            value={playerName}
                        />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="position" className="mb-1 text-gray-700 font-medium">
                            Position
                        </label>
                        <select
                            id="position"
                            className="border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            onChange={(e) => setPosition(e.target.value)}
                            value={position}
                        >
                            <option value="">Select a position</option>
                            {positions.map((pos) => (
                                <option key={pos} value={pos}>
                                    {pos}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="jerseyNumber" className="mb-1 text-gray-700 font-medium">
                            Jersey Number (1-99)
                        </label>
                        <input
                            type="number"
                            id="jerseyNumber"
                            placeholder="Jersey number"
                            min={1}
                            max={99}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            onChange={(e) => setJerseyNumber(parseInt(e.target.value) || "")}
                            value={jerseyNumber}
                        />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="age" className="mb-1 text-gray-700 font-medium">
                            Age
                        </label>
                        <input
                            type="number"
                            id="age"
                            placeholder="Age"
                            min={16}
                            max={45}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            onChange={(e) => setAge(parseInt(e.target.value) || "")}
                            value={age}
                        />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="goals" className="mb-1 text-gray-700 font-medium">
                            Goals Scored This Season
                        </label>
                        <input
                            type="number"
                            id="goals"
                            placeholder="Goals scored"
                            min={0}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            onChange={(e) => setGoals(parseInt(e.target.value) || "")}
                            value={goals}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 mt-4 bg-violet-600 text-white font-bold rounded-md hover:bg-violet-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>

        </>
    );
};

export default AddPlayer;
