"use client";
import { useState } from "react";

export default function SectionsBuilderTab({ company, setCompany }: any) {
  const [sections, setSections] = useState(company.sections || []);

  const handleAdd = () => {
    setSections([...sections, { id: Date.now().toString(), title: "", content: "" }]);
  };

  const handleChange = (id: string, key: string, value: string) => {
    setSections(sections.map((s: any) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  const handleDelete = (id: string) => {
    setSections(sections.filter((s: any) => s.id !== id));
  };

  const handleSave = async () => {
    const res = await fetch("/api/company", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections }),
    });
    if (res.ok) {
      const data = await res.json();
      setCompany(data.company);
      alert("Sections updated ✅");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sections Builder</h2>
      {sections.map((section: any) => (
        <div key={section.id} className="border p-3 mb-3 rounded bg-white">
          <input
            placeholder="Section Title"
            value={section.title}
            onChange={(e) => handleChange(section.id, "title", e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <textarea
            placeholder="Section Content"
            value={section.content}
            onChange={(e) => handleChange(section.id, "content", e.target.value)}
            className="border p-2 w-full"
          />
          <button onClick={() => handleDelete(section.id)} className="text-red-500 cursor-pointer mt-2">Delete</button>
        </div>
      ))}
      <button onClick={handleAdd} className="bg-gray-200 cursor-pointer px-4 py-2 rounded mr-2">+ Add Section</button>
      <button onClick={handleSave} className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}
