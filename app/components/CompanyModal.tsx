"use client";
import { useState } from "react";
import axios from "axios";

export default function CompanyModal({ onClose, onSuccess }: any) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async () => {
        const res = await axios.post("/api/company", { name, slug, description });
        onSuccess(res.data.company);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-[400px] flex flex-col gap-3">
                <h2 className="text-xl font-semibold">Create Company</h2>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border px-3 py-2 rounded" />
                <input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="border px-3 py-2 rounded" />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border px-3 py-2 rounded" />
                <button onClick={handleCreate} className="bg-blue-500 text-white py-2 rounded">Create</button>
            </div>
        </div>
    );
}
