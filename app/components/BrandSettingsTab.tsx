"use client";
import { useState } from "react";

export default function BrandSettingsTab({ company, setCompany }: any) {
    const [form, setForm] = useState({
        logoUrl: company.logoUrl || "",
        bannerUrl: company.bannerUrl || "",
        themeColor: company.themeColor || "#000000",
        videoUrl: company.videoUrl || "",
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
            alert("Brand updated ✅");
        } else alert("Error updating brand ❌");
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Brand Settings</h2>
            <label>Logo URL</label>
            <input name="logoUrl" value={form.logoUrl} onChange={handleChange} className="border p-2 w-full mb-2" />
            <label>Banner URL</label>
            <input name="bannerUrl" value={form.bannerUrl} onChange={handleChange} className="border p-2 w-full mb-2" />
            <label>Theme Color</label>
            <input type="color" name="themeColor" value={form.themeColor} onChange={handleChange} className="border p-2 w-20 mb-2" />
            <label>Video URL</label>
            <input name="videoUrl" value={form.videoUrl} onChange={handleChange} className="border p-2 w-full mb-4" />

            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
    );
}
