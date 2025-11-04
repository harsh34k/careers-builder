interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const tabs = [
    { key: "info", label: "🏢 Company Info" },
    { key: "brand", label: "🎨 Brand Settings" },
    { key: "sections", label: "🧩 Sections" },
    { key: "preview", label: "👁️ Preview" },
    { key: "publish", label: "🚀 Publish" },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
            <h1 className="text-xl font-bold mb-6">Dashboard</h1>
            <nav className="flex flex-col gap-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`text-left px-4 py-2 rounded-md ${activeTab === tab.key ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
