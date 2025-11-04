// "use client";
// import { useEffect, useState } from "react";
// import CompanyModal from "../components/CompanyModal";
// import CompanyForm from "../components/CompanyForm";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import CompanyInfoTab from "../components/CompanyInfoTab";
// import BrandSettingsTab from "../components/BrandSettingsTab";
// import SectionsBuilderTab from "../components/SectionsBuilderTab";
// import PreviewTab from "../components/PreviewTab";
// import PublishTab from "../components/PublishTab";
// import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function Dashboard() {
//     const [user, setUser] = useState<any>(null);
//     const [company, setCompany] = useState<any>(null);
//     const [showModal, setShowModal] = useState(false);
//     const [activeTab, setActiveTab] = useState("info")
//     const [isPreviewOpen, setIsPreviewOpen] = useState(false)
//     const [sections, setSections] = useState(company?.sections || []);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await axios.post("/api/me");
//                 setUser(res.data.user);
//                 if (res.data.user.company) {
//                     setCompany(res.data.user.company);
//                 } else {
//                     setShowModal(true);
//                 }
//             } catch {
//                 window.location.href = "/login";
//             }
//         };
//         fetchData();
//     }, []);
//     const handleAdd = () => {
//         setSections([...sections, { id: Date.now().toString(), title: "", content: "" }]);
//     };

//     const handleChange = (id: string, key: string, value: string) => {
//         setSections(sections.map((s: any) => (s.id === id ? { ...s, [key]: value } : s)));
//     };

//     const handleDelete = (id: string) => {
//         setSections(sections.filter((s: any) => s.id !== id));
//     };

//     const handleSave = async () => {
//         const data = await axios.patch("/api/company", { sections })
//         setCompany(data.data.company);
//         alert("Sections updated ✅");
//     }

//     if (!user) return <div>Loading...</div>;

//     return (
//         <div className="flex w-full h-screen">
//             {/* MAIN SECTION */}
//             <div
//                 className={`transition-all duration-300 ${isPreviewOpen ? "w-1/2" : "w-full"
//                     } p-4 bg-white flex flex-col items-center mx-20 h-screen`}
//             >
//                 <div className={`${isPreviewOpen ? "w-full" : "w-1/2 border-2 border-gray-400"
//                     }`} >
//                     <div>
//                         <div className="h-40 border-2 border-blue-600">cover image here</div>
//                         <div className="h-28 w-28 border-2 rounded-full  border-blue-600">logo rounded inside this</div>
//                     </div>
//                     <div>
//                         <Dialog>
//                             <DialogTrigger asChild>
//                                 <Button variant="outline">Save theme</Button>
//                             </DialogTrigger>
//                             <DialogContent>
//                                 <DialogHeader>
//                                     <DialogTitle>Save your system theme</DialogTitle>
//                                 </DialogHeader>
//                                 <div className="grid gap-4">
//                                     <div className="grid gap-3">
//                                         <Label htmlFor="name-1">Pick a Primary Color</Label>
//                                         <Input type="color" id="name-1" name="name" />
//                                     </div>

//                                 </div>
//                                 <DialogFooter>
//                                     <DialogClose asChild>
//                                         <Button variant="outline">Cancel</Button>
//                                     </DialogClose>
//                                     <Button type="submit">Save changes</Button>
//                                 </DialogFooter>
//                             </DialogContent>

//                         </Dialog>
//                     </div>
//                     {/* add sections */}
//                     <div>
//                         {sections?.map((section: any) => (
//                             <div key={section.id} className="border p-3 mb-3 rounded bg-white">
//                                 <input
//                                     placeholder="Section Title"
//                                     value={section.title}
//                                     onChange={(e) => handleChange(section.id, "title", e.target.value)}
//                                     className="border p-2 w-full mb-2"
//                                 />
//                                 <textarea
//                                     placeholder="Section Content"
//                                     value={section.content}
//                                     onChange={(e) => handleChange(section.id, "content", e.target.value)}
//                                     className="border p-2 w-full"
//                                 />
//                                 <button onClick={() => handleDelete(section.id)} className="text-red-500 mt-2">Delete</button>
//                             </div>
//                         ))}
//                         <button onClick={handleAdd} className="bg-gray-200 px-4 py-2 rounded mr-2">+ Add Section</button>
//                         <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
//                     </div>

//                 </div>
//             </div>

//             {/* SIDEBAR */}
//             {isPreviewOpen && (
//                 <div className="w-1/2 border-l-2 border-gray-400 p-4 bg-gray-50">
//                     <h2 className="text-lg font-semibold mb-2">Sidebar</h2>
//                     <p className="text-gray-600">here we would show preview</p>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import dynamic from "next/dynamic";
const SectionEditor = dynamic(() => import("../components/SectionEditor"), {
    ssr: false,
});

axios.defaults.withCredentials = true;

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [themeColor, setThemeColor] = useState("#2563eb");

    // Dialog form
    const [editOpen, setEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSlug, setEditSlug] = useState("");

    const [jobs, setJobs] = useState<any[]>([]);
    const [newJob, setNewJob] = useState({ title: "", description: "", location: "", jobType: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("/api/me");
                setUser(res.data.user);
                console.log("user company", res.data);

                if (res.data.user.company) {
                    const c = res.data.user.company;
                    setCompany(c);
                    setSections(c.sections || []);
                    setCoverImage(c.bannerUrl || null);
                    setLogo(c.logoUrl || null);
                    setThemeColor(c.themeColor || "#2563eb");
                    setEditName(c.name || "");
                    setEditSlug(c.slug || "");
                }
            } catch {
                window.location.href = "/login";
            }
        };
        fetchData();
    }, []);

    useEffect(() => {

        const fetchJobs = async () => {
            try {
                const res = await axios.get("/api/job");
                const data = res.data
                console.log("data ", data);
                setJobs(Array.isArray(data.jobs) ? data.jobs : [])

            } catch (error) {
                console.log("error", error)
            }
        }
        fetchJobs();
    }, [company]);

    const handleCreateJob = async () => {
        const res = await axios.post("/api/job", newJob);
        setJobs([...jobs, res.data.job]);
        setNewJob({ title: "", description: "", location: "", jobType: "" });
    };

    const handleUpdateJob = async (id: string, key: string, value: string) => {
        const updated = jobs.map(j => j.id === id ? { ...j, [key]: value } : j);
        setJobs(updated);
        await axios.patch(`/api/job/${id}`, { [key]: value });
    };

    const handleDeleteJob = async (id: string) => {
        await axios.delete(`/api/job/${id}`);
        setJobs(jobs.filter(j => j.id !== id));
    };

    // Upload handlers (you can connect Cloudinary later)
    const handleImageUpload = async (e: any, type: "cover" | "logo") => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        // const res = await fetch("/api/upload", {
        //     method: "POST",
        //     body: formData,
        // });

        // const data = await res.json();
        const res = await axios.post("/api/upload", formData);
        console.log("response", res);

        const data = res.data


        if (data) {
            if (type === "cover") setCoverImage(data.imageUrl);
            else setLogo(data.imageUrl);
            setCompany(data.company);
            alert("✅ Uploaded successfully");
        } else {
            alert("❌ Upload failed");
        }
    };


    // Save updated company info
    const handleSaveDetails = async () => {
        try {
            const payload = {
                name: editName,
                slug: editSlug,
                themeColor,
            };
            const res = await axios.patch("/api/company", payload);
            setCompany(res.data.company);
            setEditOpen(false);
            alert("Details updated ✅");
        } catch (err) {
            console.error(err);
            alert("Error saving details");
        }
    };

    const handleAddSection = () => {
        setSections([...sections, { id: Date.now().toString(), title: "", content: "" }]);
    };

    const handleChange = (id: string, key: string, value: string) => {
        setSections(sections.map((s: any) => (s.id === id ? { ...s, [key]: value } : s)));
    };

    const handleDelete = (id: string) => {
        setSections(sections.filter((s: any) => s.id !== id));
    };

    const handleSaveSections = async () => {
        const data = await axios.patch("/api/company", { sections });
        setCompany(data.data.company);
        alert("Sections updated ✅");
    };
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const reordered = Array.from(sections);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setSections(reordered);
    };
    if (!user || !company)
        return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50">
            {/* MAIN EDITOR */}
            <div
                className={`transition-all duration-300 ${isPreviewOpen ? "md:w-1/2" : "w-full"
                    } p-4 flex flex-col items-center h-full`}
            >
                <div className="w-full md:w-3/4 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    {/* Cover Image */}
                    <div className="relative h-48 bg-gray-200 flex justify-center items-center">
                        {coverImage ? (
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="object-cover w-full h-full "
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500">
                                No cover image
                            </div>
                        )}

                        {/* Upload button overlay */}
                        <label
                            htmlFor="cover-upload"
                            className="absolute top-2 right-2 bg-white/90 text-sm px-3 py-1 rounded shadow cursor-pointer hover:bg-blue-100 transition"
                        >
                            📤 Change Cover
                        </label>
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "cover")}
                        />
                    </div>

                    {/* Centered Logo */}
                    <div className="relative flex justify-center mt-[-3rem] mb-2">
                        <div className="relative h-24 w-24 rounded-full bg-gray-100 border-4 border-white overflow-hidden shadow-md">
                            {logo ? (
                                <img src={logo} alt="Logo" className="object-cover w-full h-full" />
                            ) : (
                                <p className="text-gray-500 text-xs flex items-center justify-center h-full">
                                    Upload Logo
                                </p>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "logo")}
                                className="absolute bottom-0 right-0 bg-white p-1 rounded text-xs opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Company Title */}
                    <div className="text-center mb-4 mt-2">
                        <h1 className="text-xl font-semibold">{company.name}</h1>
                        <p className="text-gray-500 text-sm">/{company.slug}</p>
                    </div>

                    {/* Edit Details Button */}
                    <div className="flex justify-center mb-4">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="text-sm">
                                    ⚙️ Edit Company Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Company Details</DialogTitle>
                                    <DialogDescription>
                                        Update your company name, slug, or theme color below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Company Name</Label>
                                        <Input
                                            id="name"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Your company name"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={editSlug}
                                            onChange={(e) => setEditSlug(e.target.value)}
                                            placeholder="Unique company slug"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Theme Color</Label>
                                        <Input
                                            type="color"
                                            value={themeColor}
                                            onChange={(e) => setThemeColor(e.target.value)}
                                            className="h-10 w-20"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSaveDetails}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end flex-wrap gap-3 mt-4 mb-2 mx-8">
                        <Button onClick={handleAddSection} variant="outline">+ Add Section</Button>
                        <Button onClick={handleSaveSections}>💾 Save</Button>
                        <Button variant="secondary" onClick={() => setIsPreviewOpen(!isPreviewOpen)}>
                            {isPreviewOpen ? "Close Preview" : "Preview"}
                        </Button>
                    </div>
                    {/* Sections Builder */}
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="sections">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                    <h1 className="text-2xl font-semibold mb-3 mx-8">Sections</h1>

                                    {sections.map((section: any, index: number) => (
                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="relative shadow-md rounded-2xl p-4 bg-white border hover:shadow-xl transition-all duration-200 mx-8"
                                                >

                                                    {/* Drag Handle */}
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="absolute left-2 top-2 text-gray-400 hover:text-gray-600 cursor-grab"
                                                        title="Drag to reorder"
                                                    >
                                                        ⠿
                                                    </div>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(section.id)}
                                                        className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 text-red-500 text-sm opacity-70 hover:opacity-100"
                                                        title="Delete Section"
                                                    >
                                                        🗑️
                                                    </button>

                                                    {/* Title */}
                                                    <input
                                                        placeholder="Section Title"
                                                        value={section.title}
                                                        onChange={(e) => handleChange(section.id, "title", e.target.value)}
                                                        className="text-lg font-semibold w-full mb-3 border-b border-transparent focus:border-gray-300 outline-none pl-6"
                                                    />

                                                    {/* ✅ Tiptap Editor */}
                                                    <SectionEditor
                                                        value={section.content}

                                                        onChange={(html: any) => handleChange(section.id, "content", html)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    {/* jobs */}
                    <div className="p-4 mt-8 mx-8">
                        <h2 className="text-lg font-semibold mb-3">💼 Job Openings</h2>

                        {/* Add New Job Form */}
                        <div className="grid gap-3 border p-4 rounded-xl bg-white shadow-sm mb-4">
                            <input className="border p-2 rounded" placeholder="Job Title"
                                value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                            <textarea className="border p-2 rounded" placeholder="Description"
                                value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
                            <input className="border p-2 rounded" placeholder="Location"
                                value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
                            <input className="border p-2 rounded" placeholder="Job Type (e.g. Full-Time)"
                                value={newJob.jobType} onChange={e => setNewJob({ ...newJob, jobType: e.target.value })} />

                            <Button onClick={handleCreateJob}>+ Add Job</Button>
                        </div>


                        {jobs?.map((job) => (
                            <div key={job.id} className="border p-4 rounded-xl bg-white shadow-sm mb-3">
                                <input className="font-semibold text-lg w-full mb-2 border-b"
                                    value={job.title} onChange={e => handleUpdateJob(job.id, "title", e.target.value)} />
                                <textarea className="w-full border rounded p-2 mb-2"
                                    value={job.description} onChange={e => handleUpdateJob(job.id, "description", e.target.value)} />
                                <input className="border p-2 rounded w-full mb-2"
                                    value={job.location} onChange={e => handleUpdateJob(job.id, "location", e.target.value)} />
                                <input className="border p-2 rounded w-full mb-2"
                                    value={job.jobType} onChange={e => handleUpdateJob(job.id, "jobType", e.target.value)} />

                                <Button variant="destructive" onClick={() => handleDeleteJob(job.id)}>Delete</Button>
                            </div>
                        ))}

                    </div>





                </div>


            </div>

            {/* PREVIEW */}
            {isPreviewOpen && (
                <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l bg-white p-4 overflow-auto">
                    <h2 className="text-xl font-bold mb-4">Live Preview 👀</h2>
                    <div className="w-full">
                        <img src={coverImage || ""} className="h-40 w-full object-cover rounded" />
                        <div className="flex justify-center mt-[-3rem]">
                            <img
                                src={logo || ""}
                                className="h-24 w-24 rounded-full border-4 border-white object-cover"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="text-lg font-semibold">{company.name}</h3>
                            <p className="text-gray-500 text-sm">/{company.slug}</p>
                        </div>
                        <div className="mt-6">
                            {sections.map((sec) => (
                                <div key={sec.id} className="mb-4">
                                    <h4 style={{ color: themeColor }} className="font-semibold text-lg">
                                        {sec.title}
                                    </h4>
                                    <p className="text-gray-600">{sec.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}















