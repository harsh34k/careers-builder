"use client";
import { useState } from "react";

export default function CompanyInfoTab({ company, setCompany }: any) {
    const [form, setForm] = useState({
        name: company.name || "",
        slug: company.slug || "",
        description: company.description || "",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const res = await fetch("/api/company", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            const data = await res.json();
            setCompany(data.company);
            alert("Company info updated ✅");
        } else {
            alert("Error updating company ❌");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Company Info</h2>
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Company Name"
                className="border p-2 w-full mb-2"
            />
            <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="Company Slug"
                className="border p-2 w-full mb-2"
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 w-full mb-4"
            />
            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Save
            </button>
        </div>
    );
}
