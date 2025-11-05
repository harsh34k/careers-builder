"use client";
import { useState } from "react";
import axios from "axios";

export default function CompanyModal({ onClose, onSuccess }: { onClose: any; onSuccess: any }) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name || !slug) {
            alert("Name and slug are required.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/api/company", { name, slug, description });
            onSuccess(res.data.company);
            onClose();
        } catch (error: any) {
            console.log(error);
            alert(error?.response?.data?.error || "Something went wrong while creating company.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-xl w-[420px] shadow-xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-center mb-4">Create Your Company</h2>

                <div className="space-y-3">
                    <input
                        placeholder="Company Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-gray-300 outline-none"
                    />

                    <input
                        placeholder="Unique Slug (e.g. your-company)"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-gray-300 outline-none"
                    />

                    <textarea
                        placeholder="Short description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-gray-300 outline-none min-h-[80px]"
                    />
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="bg-black text-white px-5 py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Company"}
                    </button>
                </div>
            </div>
        </div>
    );
}
