"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Section {
    id: string;
    title: string;
    content: string;
}

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    work_policy: string;
    employment_type: string;
    department: string;
    experience_level: string;
    job_type: string;
    salary_range: string;
    createdAt: string;
}

interface Company {
    name: string;
    logoUrl?: string;
    bannerUrl?: string;
    themeColor?: string;
    description?: string;
    sections: Section[];
    jobs: Job[];
}

export default function CareersPage({ params }: any) {
    const { slug }: { slug: string } = React.use(params)

    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<{ urls: { regular: string } }[]>([]);
    const [sectionImages, setSectionImages] = useState<{ [key: string]: string | null }>({});
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        work_policy: "",
        employment_type: "",
        job_type: "",
        experience_level: "",
    });

    const WORK_POLICY_OPTIONS = ["ONSITE", "HYBRID", "REMOTE"];
    const EMPLOYMENT_TYPE_OPTIONS = ["FULLTIME", "PARTTIME", "CONTRACT"];
    const JOB_TYPE_OPTIONS = ["PERMANENT", "TEMPORARY", "INTERNSHIP"];
    const EXPERIENCE_LEVEL_OPTIONS = ["SENIOR", "MIDLEVEL", "JUNIOR"];

    useEffect(() => {
        const fetchCompany = async () => {
            const res = await axios.get(`/api/public/${slug}`);
            setCompany(res.data);
            setLoading(false);
        };
        fetchCompany();
    }, [slug]);

    useEffect(() => {
        const fetchImages = async () => {
            const res = await axios.get("/api/unsplash");
            setImages(res.data.results);
        };
        fetchImages();
    }, []);
    useEffect(() => {
        if (company && images.length > 0) {
            const mapping: { [key: string]: string | null } = {};
            company.sections.forEach((sec) => {
                const random = images[Math.floor(Math.random() * images.length)];
                mapping[sec.id] = random ? random.urls.regular : null;
            });
            setSectionImages(mapping);
        }
    }, [company, images]);
    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading…
            </div>
        );

    if (!company)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
                Company not found
            </div>
        );

    const { name, logoUrl, bannerUrl, themeColor, sections, jobs } = company;

    const filteredJobs = jobs.filter((job) => {
        return (
            job.title.toLowerCase().includes(search.toLowerCase()) &&
            (filters.work_policy === "" || job.work_policy === filters.work_policy) &&
            (filters.employment_type === "" ||
                job.employment_type === filters.employment_type) &&
            (filters.job_type === "" || job.job_type === filters.job_type) &&
            (filters.experience_level === "" ||
                job.experience_level === filters.experience_level)
        );
    });

    return (
        <main className="min-h-screen bg-white">

            {/* Banner */}
            <section className="relative w-full h-52 md:h-72 bg-gray-200">
                {bannerUrl && (
                    <img src={bannerUrl} alt="banner" className="w-full h-full object-cover" />
                )}
            </section>

            {/* Logo + Company Name */}
            <section className="relative flex flex-col items-center -mt-16 md:-mt-24 z-10 px-4">
                {logoUrl && (
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                        <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
                    </div>
                )}
                <h1 className="mt-4 text-3xl md:text-4xl font-bold" style={{ color: themeColor }}>
                    {name}
                </h1>
            </section>

            {/* Sections */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 space-y-20">
                {sections?.map((sec, index) => {
                    const randomImage = sectionImages[sec.id];

                    const isReversed = index % 2 === 1;
                    const bgColor = index % 2 === 0 ? "bg-[#F2F0EF]" : "bg-white";

                    return (
                        <div key={sec.id} className="w-full">
                            <h2
                                style={{ color: themeColor }}
                                className="text-2xl md:text-3xl text-center font-semibold mb-8"
                            >
                                {sec.title}
                            </h2>

                            <div
                                className={`
            flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}
            items-center justify-between gap-10
            rounded-lg p-6 md:p-10
            ${bgColor}
          `}
                            >
                                {/* Text Content */}
                                <div className="prose max-w-none text-gray-700 w-full md:w-1/2">
                                    <div dangerouslySetInnerHTML={{ __html: sec.content }} />
                                </div>

                                {/* Image */}
                                {randomImage && (
                                    <div className="w-full md:w-1/2 flex justify-center">
                                        <Image
                                            src={randomImage}
                                            alt="Section visual"
                                            width={700}
                                            height={450}
                                            className="w-full max-h-80 object-cover rounded-xl shadow-md"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* Jobs */}
            <section className="bg-gray-50 px-4 sm:px-6 lg:px-16 py-16">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <h2 style={{ color: themeColor }} className="text-3xl font-bold mb-3">
                        Join the team, we are hiring!
                    </h2>
                    <p className="text-gray-600 text-lg">
                        We would love to meet talented people like you.
                    </p>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-8">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="flex-1 border rounded-lg px-4 py-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filters.work_policy}
                        onChange={(e) => setFilters({ ...filters, work_policy: e.target.value })}
                    >
                        <option value="">Workplace Type</option>
                        {WORK_POLICY_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>

                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filters.employment_type}
                        onChange={(e) =>
                            setFilters({ ...filters, employment_type: e.target.value })
                        }
                    >
                        <option value="">Employment Type</option>
                        {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>

                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filters.job_type}
                        onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
                    >
                        <option value="">Job Type</option>
                        {JOB_TYPE_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>

                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filters.experience_level}
                        onChange={(e) =>
                            setFilters({ ...filters, experience_level: e.target.value })
                        }
                    >
                        <option value="">Experience Level</option>
                        {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* Job List */}
                <div className="divide-y divide-gray-200">
                    {filteredJobs.length === 0 ? (
                        <p className="text-gray-600 text-center py-10">
                            No matching jobs found.
                        </p>
                    ) : (
                        filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    <a href={`/public/${slug}/${job.id}`}>
                                        <h3
                                            className="text-lg font-semibold hover:underline"
                                            style={{ color: themeColor }}
                                        >
                                            {job.title}
                                        </h3>
                                    </a>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Posted {job.createdAt ? job.createdAt : "recently"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm text-gray-600 md:w-136 justify-between">
                                    <span>{job.work_policy}</span>
                                    <span>{job.employment_type}</span>
                                    <span>{job.job_type}</span>
                                    <span>{job.experience_level}</span>
                                    <span>{job.location}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
