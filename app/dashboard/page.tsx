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
import dynamic from "next/dynamic";

import CompanyModal from "../components/CompanyModal";

import SectionBuilder from "../components/SectionBuilder";
import JobManager from "../components/JobManager";


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
    const [isPublished, setIsPublished] = useState(false);



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
                setIsPublished(res.data?.user?.company?.isPublished)
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
    const handlePublishChange = async () => {
        try {
            const res = await axios.patch("/api/company", {
                isPublished: !(company.isPublished),
            });

            // Update state with new company
            console.log("res.data.", res.data);

            setCompany(res.data.company);
            setIsPublished(res.data.company.isPublished)
            alert(`Company is now ${res.data.company.isPublished ? "Published" : "Unpublished"} `);

        } catch (error) {
            console.error(error);
            alert("Error updating publish status");
        }
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

    const handleImageUpload = async (e: any, type: "cover" | "logo") => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

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

                            </div>

                            {/* Edit Details Button */}
                            <div className="flex justify-end mb-4 mx-7">
                                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="text-sm cursor-pointer">
                                            Edit Company Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="ali">Edit Company Details</DialogTitle>
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
                                                <p className="text-gray-400 text-sm">Theme will be used as you primary color i.e Heading color, Button color etc</p>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button className="cursor-pointer" onClick={handleSaveDetails}>Save Changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {/* Buttons */}
                            <div className="flex justify-end flex-wrap gap-3 mt-4 mb-2 mx-8">
                                <Button className="cursor-pointer" onClick={handleAddSection} variant="outline">+ Add Section</Button>
                                <Button className="cursor-pointer" onClick={handleSaveSections}>💾 Save</Button>
                                <Button className="cursor-pointer" variant="secondary" onClick={() => router.push(`/preview/${editSlug}`)}>
                                    Preview
                                </Button>
                                <Button className="cursor-pointer" variant="secondary" onClick={handlePublishChange}>
                                    {isPublished ? "UnPublish" : "Publish"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        const publicUrl = `${window.location.origin}/public/${company.slug}`;
                                        navigator.clipboard.writeText(publicUrl);
                                        alert("Public link copied ✅");
                                    }}
                                >
                                    Copy Public Link
                                </Button>

                            </div>
                            {/* Sections Builder */}
                            <SectionBuilder
                                sections={sections}
                                handleDragEnd={handleDragEnd}
                                handleChange={handleChange}
                                handleDelete={handleDelete}
                                handleAddSection={handleAddSection}
                                handleSaveSections={handleSaveSections}
                            />

                            {/* jobs */}
                            <JobManager
                                jobs={jobs}
                                themeColor={themeColor}
                                newJob={newJob}
                                setNewJob={setNewJob}
                                showJobForm={showJobForm}
                                setShowJobForm={setShowJobForm}
                                handleCreateJob={handleCreateJob}
                                handleUpdateJob={handleUpdateJob}
                                handleDeleteJob={handleDeleteJob}
                                JOB_TYPE_OPTIONS={JOB_TYPE_OPTIONS}
                                WORK_POLICY_OPTIONS={WORK_POLICY_OPTIONS}
                                EMPLOYMENT_TYPE_OPTIONS={EMPLOYMENT_TYPE_OPTIONS}
                                EXPERIENCE_LEVEL_OPTIONS={EXPERIENCE_LEVEL_OPTIONS}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}















