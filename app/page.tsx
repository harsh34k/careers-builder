"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to WorkWave</h1>
      <div className="flex gap-4">
        <button onClick={() => router.push("/login")} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <button onClick={() => router.push("/signup")} className="bg-gray-500 text-white px-4 py-2 rounded">
          Signup
        </button>
      </div>
    </div>
  );
}
