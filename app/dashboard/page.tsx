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
import { useRouter } from "next/navigation";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import dynamic from "next/dynamic";
import EditableSelectField from "../components/EditableSelectField";
import CompanyModal from "../components/CompanyModal";
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
    const [showJobForm, setShowJobForm] = useState(false);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);



    // Dialog form
    const [editOpen, setEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSlug, setEditSlug] = useState("");

    const [jobs, setJobs] = useState<any[]>([]);
    const [newJob, setNewJob] = useState({ title: "", description: "", location: "", employment_type: "", experience_level: "", job_type: "", salary_range: "", work_policy: "", department: "" });

    const JOB_TYPE_OPTIONS = ["PERMANENT", "TEMPORARY", "INTERNSHIP"];
    const WORK_POLICY_OPTIONS = ["ONSITE", "HYBRID", "REMOTE"];
    const EMPLOYMENT_TYPE_OPTIONS = ["FULLTIME", "PARTTIME", "CONTRACT"];
    const EXPERIENCE_LEVEL_OPTIONS = ["SENIOR", "MIDLEVEL", "JUNIOR"];


    const router = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("/api/me");
                setUser(res.data.user);
                console.log("user company", res.data);

                if (res.data.user.company && !(res.data.user.company == null)) {
                    const c = res.data.user.company;
                    setCompany(c);
                    setSections(c.sections || []);
                    setCoverImage(c.bannerUrl || null);
                    setLogo(c.logoUrl || null);
                    setThemeColor(c.themeColor || "#2563eb");
                    setEditName(c.name || "");
                    setEditSlug(c.slug || "");
                }
                else {
                    console.log("reaching here");

                    setShowCompanyModal(true);
                }
            } catch {
                window.location.href = "/login";
            } finally {
                setLoadingUser(false);
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
        setNewJob({ title: "", description: "", location: "", employment_type: "", experience_level: "", job_type: "", salary_range: "", work_policy: "", department: "" });
        setShowJobForm(false)
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
    if (loadingUser)
        return <div className="flex justify-center items-center h-screen">Loading...</div>;


    return (
        <>
            {showCompanyModal ? (

                <CompanyModal

                    onSuccess={(createdCompany: any) => {
                        setCompany(createdCompany);
                        setShowCompanyModal(false);
                    }}
                    onClose={() => setShowCompanyModal(false)}
                />
            ) : (

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
                                <Button variant="secondary" onClick={() => router.push(`/preview/${editSlug}`)}>
                                    Preview
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
                            <section className="bg-gray-50 px-6 md:px-16 py-16 border-t mt-12">

                                {/* Heading + Intro (matches preview style) */}
                                <div className="text-center max-w-3xl mx-auto mb-12">
                                    <h2 className="text-3xl font-bold mb-4" style={{ color: themeColor }}>
                                        Join the team, we're hiring!
                                    </h2>
                                    <p className="text-gray-600 text-lg">
                                        Enough about us. We’re more interested in you. If you’re bright, bold, and looking for more than just a job — we’d love to meet you.
                                    </p>
                                </div>

                                {/* Add Job Button */}
                                <div className="flex justify-end mb-6">
                                    <Button onClick={() => setShowJobForm(true)}>+ Add Job</Button>
                                </div>

                                {/* Add Job Modal */}
                                {showJobForm && (
                                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                                        <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl space-y-4">

                                            <h3 className="text-lg font-semibold">Create Job</h3>

                                            <input className="border rounded px-3 py-2 w-full"
                                                placeholder="Job Title"
                                                value={newJob.title}
                                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                            />

                                            <textarea className="border rounded px-3 py-2 w-full"
                                                placeholder="Job Description"
                                                value={newJob.description}
                                                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                            />

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input
                                                    className="border rounded px-3 py-2 w-full"
                                                    placeholder="Location"
                                                    value={newJob.location}
                                                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                                />

                                                <select
                                                    className="border rounded px-3 py-2 w-full"
                                                    value={newJob.job_type}
                                                    onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
                                                >
                                                    <option value="">Select Job Type</option>
                                                    {JOB_TYPE_OPTIONS.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select
                                                    className="border rounded px-3 py-2 w-full"
                                                    value={newJob.work_policy}
                                                    onChange={(e) => setNewJob({ ...newJob, work_policy: e.target.value })}
                                                >
                                                    <option value="">Select Work Policy</option>
                                                    {WORK_POLICY_OPTIONS.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select
                                                    className="border rounded px-3 py-2 w-full"
                                                    value={newJob.employment_type}
                                                    onChange={(e) =>
                                                        setNewJob({ ...newJob, employment_type: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select Employment Type</option>
                                                    {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select
                                                    className="border rounded px-3 py-2 w-full"
                                                    value={newJob.experience_level}
                                                    onChange={(e) =>
                                                        setNewJob({ ...newJob, experience_level: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select Experience Level</option>
                                                    {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>

                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input className="border rounded px-3 py-2 w-full"
                                                    placeholder="Department (e.g. Engineering)"
                                                    value={newJob.department}
                                                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                                                />

                                                <input className="border rounded px-3 py-2 w-full"
                                                    placeholder="Salary range (e.g. $80k - $100k)"
                                                    value={newJob.salary_range}
                                                    onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                                                />



                                            </div>

                                            <div className="flex justify-end gap-3 pt-2">
                                                <Button variant="outline" onClick={() => setShowJobForm(false)}>Cancel</Button>
                                                <Button onClick={handleCreateJob}>Save Job</Button>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* Job List (matches preview style layout) */}
                                <div className="divide-y divide-gray-200 mt-8">
                                    {jobs.length === 0 && (
                                        <p className="text-gray-500 text-center py-10">No jobs created yet.</p>
                                    )}

                                    {jobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                                        >
                                            {/* Editable Job Title */}
                                            <div>
                                                <input
                                                    className="text-lg font-semibold border-b border-gray-300 focus:outline-none"
                                                    style={{ color: themeColor }}
                                                    value={job.title}
                                                    onChange={(e) => handleUpdateJob(job.id, "title", e.target.value)}
                                                />
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Posted {job.createdAt || "Recently"}
                                                </p>
                                            </div>

                                            {/* Editable Meta Info */}
                                            <div className="flex flex-col md:flex-row md:items-center gap-6 text-sm text-gray-700">

                                                <input
                                                    className="border px-2 py-1 rounded"
                                                    value={job.location}

                                                    onChange={(e) => handleUpdateJob(job.id, "location", e.target.value)}
                                                />

                                                <EditableSelectField
                                                    job={job}
                                                    field="work_policy"
                                                    options={WORK_POLICY_OPTIONS}
                                                    onSave={handleUpdateJob}
                                                />

                                                <EditableSelectField
                                                    job={job}
                                                    field="employment_type"
                                                    options={EMPLOYMENT_TYPE_OPTIONS}
                                                    onSave={handleUpdateJob}
                                                />

                                                <EditableSelectField
                                                    job={job}
                                                    field="job_type"
                                                    options={JOB_TYPE_OPTIONS}
                                                    onSave={handleUpdateJob}
                                                />

                                                <EditableSelectField
                                                    job={job}
                                                    field="experience_level"
                                                    options={EXPERIENCE_LEVEL_OPTIONS}
                                                    onSave={handleUpdateJob}
                                                />

                                            </div>

                                            <Button variant="destructive" onClick={() => handleDeleteJob(job.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                            </section>







                        </div>


                    </div>


                </div>

            )}
        </>
    );

}















