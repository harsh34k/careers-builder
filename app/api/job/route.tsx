import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client"
import verifyJWT from "@/lib/jwt";

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);
        const body = await req.json();
        const { title, description, location, employment_type, experience_level, job_type, salary_range, work_policy, department } = body;

        // Find company for recruiter
        const company = await prisma.company.findFirst({
            where: { recruiterId: decoded.id },
        });

        if (!company)
            return NextResponse.json({ error: "No company found for recruiter" }, { status: 404 });
        const job = await prisma.job.create({
            data: {
                title,
                description,
                location,
                employment_type,
                experience_level,
                companyId: company.id,
                job_type,
                salary_range,
                work_policy,
                department

            }
        })

        return NextResponse.json({ job }, { status: 201 });
    } catch (err) {
        console.error("POST /job error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET all jobs for recruiter’s company
export async function GET(req: Request) {
    try {
        console.log("here");

        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);

        const company = await prisma.company.findFirst({
            where: { recruiterId: decoded.id },
            include: { jobPosts: true },
        });

        if (!company)
            return NextResponse.json({ error: "No company found" }, { status: 404 });
        console.log("company jobs", company.jobPosts);
        return NextResponse.json({ jobs: company.jobPosts });
    } catch (err) {
        console.error("GET /job error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ✅ unwrap the promise

        if (!id) {
            return NextResponse.json({ error: "Missing job id" }, { status: 400 });
        }

        const cookieHeader = req.headers.get("cookie") ?? "";
        const token = cookieHeader.split("token=")[1]?.split(";")[0];

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyJWT(token);

        const job = await prisma.job.findUnique({
            where: { id }, // ✅ use id (not params.id)
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        await prisma.job.delete({ where: { id } });

        return NextResponse.json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error("DELETE /job/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
