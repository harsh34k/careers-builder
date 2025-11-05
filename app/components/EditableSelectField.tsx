"use client";
import { useState } from "react";
import { Pencil } from "lucide-react"; // If you're using lucide-react. If not, replace with emoji.

export default function EditableSelectField({
    job,
    field,
    options,
    onSave
}: {
    job: any;
    field: string;
    options: string[];
    onSave: (jobId: string, field: string, value: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const value = job[field];

    return (
        <div className="relative inline-block">
            {isEditing ? (
                <select
                    autoFocus
                    className="border px-2 py-1 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={value}
                    onChange={(e) => {
                        onSave(job.id, field, e.target.value);
                        setIsEditing(false);
                    }}
                    onBlur={() => setIsEditing(false)}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 pr-2 pl-3 py-1 border rounded-md bg-gray-50 hover:bg-gray-100 transition text-sm"
                >
                    <span>{value}</span>
                    <Pencil size={14} className="text-gray-400 hover:text-gray-600 transition" />

                </button>
            )}
        </div>
    );
}
