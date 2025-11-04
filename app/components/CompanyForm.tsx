"use client";
import { useState } from "react";
import axios from "axios";

export default function CompanyForm({ company }: any) {
    const [form, setForm] = useState(company);
    const [preview, setPreview] = useState(false);

    const handleSave = async () => {
        await axios.patch("/api/company", form);
        alert("Company updated!");
    };

    if (preview)
        return (
            <div>
                <h2 className="text-xl font-bold">{form.name}</h2>
                <p>{form.description}</p>
                <button onClick={() => setPreview(false)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Back to Edit</button>
            </div>
        );

    return (
        <div className="flex flex-col gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded" />
            <div className="flex gap-2">
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setPreview(true)} className="bg-gray-500 text-white px-4 py-2 rounded">Preview</button>
            </div>
        </div>
    );
}
