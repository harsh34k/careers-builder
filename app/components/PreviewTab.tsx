export default function PreviewTab({ company }: any) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Preview</h2>
            <div
                style={{ borderTop: `4px solid ${company.themeColor || "#000"}` }}
                className="bg-white p-6 rounded shadow"
            >
                {company.bannerUrl && (
                    <img src={company.bannerUrl} alt="Banner" className="w-full h-40 object-cover rounded mb-4" />
                )}
                <div className="flex items-center gap-3 mb-4">
                    {company.logoUrl && <img src={company.logoUrl} alt="Logo" className="w-16 h-16 rounded" />}
                    <div>
                        <h3 className="text-xl font-semibold">{company.name}</h3>
                        <p>{company.description}</p>
                    </div>
                </div>
                {company.sections?.map((sec: any) => (
                    <div key={sec.id} className="mb-4">
                        <h4 className="text-lg font-semibold">{sec.title}</h4>
                        <p>{sec.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
