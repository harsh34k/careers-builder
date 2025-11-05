"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            await axios.post("/api/auth/login", { email, password });
            router.push("/dashboard");
        } catch (error: any) {
            alert(error?.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
            <h2 className="text-3xl font-semibold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Log in to continue</p>

            <div className="w-full max-w-sm space-y-4">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />

                <input
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />

                {/* Normal Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Test User Login Button */}
                <button
                    onClick={async () => {
                        try {
                            setLoading(true);
                            await axios.post("/api/auth/login", {
                                email: "Harsh",
                                password: "12344",
                            });
                            router.push("/dashboard");
                        } catch (error: any) {
                            alert(error?.response?.data?.error || "Test login failed.");
                        } finally {
                            setLoading(false);
                        }
                    }}
                    disabled={loading}
                    className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Login as Test User"}
                </button>
            </div>


            <p className="mt-6 text-sm text-gray-500">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                </a>
            </p>
        </main>
    );
}
