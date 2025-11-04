"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignup = async () => {
        await axios.post("/api/auth/register", { email, password });
        router.push("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h2 className="text-2xl font-bold">Signup</h2>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border px-3 py-2 rounded" />
            <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border px-3 py-2 rounded" />
            <button onClick={handleSignup} className="bg-blue-500 text-white px-4 py-2 rounded">Create Account</button>
        </div>
    );
}
