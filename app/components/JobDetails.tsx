"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
    company: {
        name: string;
        logoUrl?: string;
        bannerUrl?: string;
        themeColor?: string;
    };
}

export default function JobDetailsPage({ params }: any) {
    const { jobId }: { jobId: string } = React.use(params);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<any>()


    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`/api/job/${jobId}`);
                // const compRes = await axios.get(`/api/company/${res.data.job.companyId}`)
                const compRes = await axios.get(`/api/company`)
                setCompany(compRes.data.company)
                console.log("res", res);
                console.log("comp", compRes.data.company);

                setJob(res.data.job);
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobId]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading...
            </div>
        );

    if (!job)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
                Job not found
            </div>
        );


    const themeColor = company?.themeColor || "#2563eb"

    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            {/* Banner */}

            <section className="relative w-full h-52 md:h-72 bg-gray-200">
                {company?.bannerUrl && (
                    <img
                        src={company?.bannerUrl}
                        alt="banner"
                        className="w-full h-full object-cover"
                    />
                )}
            </section>

            {/* Logo + Company Name */}
            <section className="relative flex flex-col items-center -mt-16 md:-mt-24 z-10 px-4 text-center">
                {company?.logoUrl && (
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                        <img
                            src={company.logoUrl}
                            alt="logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <h1
                    className="mt-4 text-3xl md:text-4xl font-bold"
                    style={{ color: themeColor }}
                >
                    {company?.name}
                </h1>
            </section>

            {/* Job Details */}
            <section className="max-w-4xl w-full mt-12 px-6 md:px-0 space-y-10">
                {/* Job Title */}

                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900">
                        {job.title}
                    </h2>
                    <p className="text-gray-600">{job.location}</p>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: themeColor }}>Description:</h1>
                {/* Description */}
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>

                {/* Meta Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-8">
                    <div>
                        <p className="text-sm text-gray-500">Work Policy</p>
                        <p className="font-medium">{job.work_policy}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Employment Type</p>
                        <p className="font-medium">{job.employment_type}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Job Type</p>
                        <p className="font-medium">{job.job_type}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Experience Level</p>
                        <p className="font-medium">{job.experience_level}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{job.department}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Salary Range</p>
                        <p className="font-medium">{job.salary_range}</p>
                    </div>
                </div>


                <div className="text-center mt-12">
                    <button
                        className="px-8 py-3 bg-blue-600 cursor-pointer text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                        style={{ backgroundColor: themeColor }}
                    >
                        Apply Now
                    </button>
                </div>
            </section>
        </main>
        // <div>hello</div>

    );
}
