"use client";

import { useState } from "react";

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
    console.log("value", value);


    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <select
                    className="border px-2 py-1 rounded"
                    value={value}
                    onChange={(e) => {
                        onSave(job.id, field, e.target.value);
                        setIsEditing(false);
                    }}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            ) : (
                <span className="border px-2 py-1 rounded">{value}</span>
            )}
            {/* {isEditing ?} */}
            {/* <span className="border px-2 py-1 rounded">{value}</span> */}
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-gray-600"
            >
                ✏️
            </button>
        </div>
    );
}
