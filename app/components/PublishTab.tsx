"use client";
export default function PublishTab({ company, setCompany }: any) {
    const handleToggle = async () => {
        const res = await fetch("/api/company", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPublished: !company.isPublished }),
        });
        if (res.ok) {
            const data = await res.json();
            setCompany(data.company);
            alert("Publish status updated ✅");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Publish Settings</h2>
            <p>Public URL: /company/{company.slug}</p>
            <button
                onClick={handleToggle}
                className={`mt-3 px-4 py-2 rounded ${company.isPublished ? "bg-red-500" : "bg-green-500"
                    } text-white`}
            >
                {company.isPublished ? "Unpublish" : "Publish"}
            </button>
        </div>
    );
}
