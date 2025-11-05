"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        try {
            setLoading(true);
            await axios.post("/api/auth/register", { email, password });
            router.push("/login");
        } catch (error: any) {
            alert(error?.response?.data?.error || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
            <h2 className="text-3xl font-semibold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mb-8">Join Us and start building your hiring page.</p>

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

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                    Login
                </a>
            </p>
        </main>
    );
}
