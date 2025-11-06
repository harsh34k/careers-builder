"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* Logo / Brand */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
        Carrers
      </h1>

      <p className="text-gray-500 mt-2 text-center max-w-sm">
        Create beautiful career pages & manage your hiring effortlessly.
      </p>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 cursor-pointer transition"
        >
          Sign up
        </button>
      </div>

    </main>
  );
}
