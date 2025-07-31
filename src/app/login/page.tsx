"use client";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/dashboard");
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);




        try {

            const response = await axios.post("/api/auth/login", {
                userName: email,
                password
            });
            const { token, user } = response.data;
            toast.success("Login successful! Redirecting...");
            localStorage.setItem("token", token);



           router.push("/dashboard")
        } catch (error: any) {

            const errorMessage = error.response?.data?.error ||
                error.message ||
                "Login failed. Please try again.";
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
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Sign in to your account to continue
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">


                            <div className="text-sm">
                                <button
                                    type="button"
                                    className="text-violet-700 hover:text-violet-900 font-medium"
                                    onClick={() => router.push("/forgot-password")}
                                >
                                    Forgot password?
                                </button>
                            </div>
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
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <button
                                onClick={() => router.push("/register")}
                                className="text-violet-700 font-semibold hover:underline"
                            >
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;