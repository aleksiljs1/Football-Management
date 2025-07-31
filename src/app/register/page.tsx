"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("/api/auth/register", {
                userName: email,
                password
            });

            toast.success("Registration successful! Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);
        } catch (error: any) {

            const errorMessage = error.response?.data?.error ||
                error.message ||
                "Registration failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Header/>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-violet-800 mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600">
                            Join our platform. Fill in your details to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-violet-800 text-white py-3 rounded-lg font-semibold transition-colors shadow-md ${
                                loading
                                    ? "opacity-70 cursor-not-allowed"
                                    : "hover:bg-violet-900"
                            }`}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={() => router.push("/login")}
                                className="text-violet-700 font-semibold hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;