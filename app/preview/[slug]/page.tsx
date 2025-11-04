"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import * as React from 'react'

interface Params {
    params: { companySlug: string };
}

interface Section {
    id: string;
    title: string;
    content: string;
}

interface Job {
    id: string;
    title: string;
    description: string;
    location?: string;
    jobType?: string;
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

    useEffect(() => {
        axios.get(`/api/public/${slug}`)
            .then((res) => {
                console.log("response", res.data)
                setCompany(res.data)
            })
            .catch(() => setCompany(null))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading…
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
                Company not found
            </div>
        );
    }


    const { name, logoUrl, bannerUrl, themeColor, description, sections, jobs } = company;

    return (
        <main className="min-h-screen bg-white">
            {/* Banner */}
            {/* Banner */}
            <section className="relative w-full h-52 md:h-72 bg-gray-200">
                {bannerUrl && (
                    <img
                        src={bannerUrl}
                        alt={`${name} banner`}
                        className="w-full h-full object-cover"
                    />
                )}
            </section>

            {/* Logo + Name */}
            <section className="relative flex flex-col items-center -mt-16 md:-mt-24 z-10 px-4">
                {/* ✅ Logo wrapper must have z-index */}
                {logoUrl && (
                    <div className="relative z-20 h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                        <img
                            src={logoUrl}
                            alt={`${name} logo`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Company Name */}
                <h1 className="mt-4 text-2xl md:text-4xl font-bold text-gray-900" style={{ color: themeColor }}>
                    {name}
                </h1>
            </section>


            {/* Sections */}
            <section className="px-6 md:px-16 py-12 space-y-10">
                {sections?.map((sec) => (
                    <div key={sec.id}>
                        <h2 style={{ color: themeColor }} className="text-2xl font-semibold mb-3">
                            {sec.title}
                        </h2>
                        <div className="prose max-w-none prose-p:text-green-600 prose-li:text-gray-700">
                            <div dangerouslySetInnerHTML={{ __html: sec.content }} />
                        </div>
                    </div>
                ))}
            </section>

            {/* Jobs */}
            <section className="bg-gray-50 px-6 md:px-16 py-12">
                <h2 style={{ color: themeColor }} className="text-2xl font-semibold mb-6">
                    Open Roles
                </h2>

                {jobs?.length === 0 && (
                    <p className="text-gray-600">No openings at the moment.</p>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {jobs?.map((job) => (
                        <div
                            key={job.id}
                            className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                        >
                            <h3 className="text-lg font-bold" style={{ color: themeColor }}>
                                {job.title}
                            </h3>
                            <p className="text-gray-600 mt-2">{job.description.slice(0, 140)}…</p>
                            <div className="mt-4 flex justify-between text-sm text-gray-500">
                                <span>{job.location} · {job.jobType}</span>
                                <a
                                    href={`/${slug}/careers/job/${job.id}`}
                                    className="font-semibold"
                                    style={{ color: themeColor }}
                                >
                                    View →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
