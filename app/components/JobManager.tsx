"use client";
import EditableSelectField from "./EditableSelectField";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function JobManager({
    jobs,
    themeColor,
    newJob,
    setNewJob,
    showJobForm,
    setShowJobForm,
    handleCreateJob,
    handleUpdateJob,
    handleDeleteJob,
    JOB_TYPE_OPTIONS,
    WORK_POLICY_OPTIONS,
    EMPLOYMENT_TYPE_OPTIONS,
    EXPERIENCE_LEVEL_OPTIONS,
}: any) {
    return (
        <section className="bg-gray-50 px-6 md:px-16 py-16 border-t mt-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4" style={{ color: themeColor }}>
                    Join the team, we are hiring!
                </h2>
                <p className="text-gray-600 text-lg">
                    Enough about us. If you are bold and talented — we would love to meet you.
                </p>
            </div>

            <div className="flex cursor-pointer justify-end mb-6">
                <Button onClick={() => setShowJobForm(true)}>+ Add Job</Button>
            </div>

            {/* MODAL */}
            {showJobForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl space-y-4">
                        <h3 className="text-lg font-semibold">Create Job</h3>

                        <input
                            placeholder="Job Title"
                            className="border rounded px-3 py-2 w-full"
                            value={newJob.title}
                            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        />

                        <textarea
                            placeholder="Job Description"
                            className="border rounded px-3 py-2 w-full"
                            value={newJob.description}
                            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                placeholder="Location"
                                className="border rounded px-3 py-2 w-full"
                                value={newJob.location}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                            />

                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={newJob.job_type}
                                onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
                            >
                                <option value="">Job Type</option>
                                {JOB_TYPE_OPTIONS.map((opt: any) => <option key={opt}>{opt}</option>)}
                            </select>

                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={newJob.work_policy}
                                onChange={(e) => setNewJob({ ...newJob, work_policy: e.target.value })}
                            >
                                <option value="">Work Policy</option>
                                {WORK_POLICY_OPTIONS.map((opt: any) => <option key={opt}>{opt}</option>)}
                            </select>

                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={newJob.employment_type}
                                onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value })}
                            >
                                <option value="">Employment Type</option>
                                {EMPLOYMENT_TYPE_OPTIONS.map((opt: any) => <option key={opt}>{opt}</option>)}
                            </select>

                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={newJob.experience_level}
                                onChange={(e) => setNewJob({ ...newJob, experience_level: e.target.value })}
                            >
                                <option value="">Experience Level</option>
                                {EXPERIENCE_LEVEL_OPTIONS.map((opt: any) => <option key={opt}>{opt}</option>)}
                            </select>
                            <input
                                placeholder="Department"
                                className="border rounded px-3 py-2 w-full"
                                value={newJob.department}
                                onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                            />
                            <input
                                placeholder="Salary Range"
                                className="border rounded px-3 py-2 w-full"
                                value={newJob.salary_range}
                                onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                            />
                        </div>

                        <div className="flex  justify-end gap-3 pt-2">
                            <Button className="cursor-pointer" variant="outline" onClick={() => setShowJobForm(false)}>Cancel</Button>
                            <Button className="cursor-pointer" onClick={handleCreateJob}>Save Job</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* JOB LIST */}
            <div className="divide-y divide-gray-200 mt-8">
                {jobs.length === 0 && <p className="text-gray-500 text-center py-10">No jobs yet.</p>}

                {jobs.map((job: any) => (
                    <div key={job.id} className="py-6 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <input
                                className="text-lg font-semibold border rounded px-2 focus:outline-none"
                                style={{ color: themeColor }}
                                value={job.title}
                                onChange={(e) => handleUpdateJob(job.id, "title", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <input
                                className="border px-2 py-1 rounded"
                                value={job.location}
                                onChange={(e) => handleUpdateJob(job.id, "location", e.target.value)}
                            />

                            <EditableSelectField job={job} field="work_policy" options={WORK_POLICY_OPTIONS} onSave={handleUpdateJob} />
                            <EditableSelectField job={job} field="employment_type" options={EMPLOYMENT_TYPE_OPTIONS} onSave={handleUpdateJob} />
                            <EditableSelectField job={job} field="job_type" options={JOB_TYPE_OPTIONS} onSave={handleUpdateJob} />
                            <EditableSelectField job={job} field="experience_level" options={EXPERIENCE_LEVEL_OPTIONS} onSave={handleUpdateJob} />
                        </div>

                        <button onClick={() => handleDeleteJob(job.id)} className="p-2 cursor-pointer hover:bg-red-100 text-red-500 rounded transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
