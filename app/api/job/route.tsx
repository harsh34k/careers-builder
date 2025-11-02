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
        const { title, description, location, jobType } = body;

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
                jobType,
                companyId: company.id,
            },
        });

        return NextResponse.json({ job }, { status: 201 });
    } catch (err) {
        console.error("POST /job error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET all jobs for recruiter’s company
export async function GET(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);

        const company = await prisma.company.findFirst({
            where: { recruiterId: decoded.id },
            include: { jobPosts: true },
        });

        if (!company)
            return NextResponse.json({ error: "No company found" }, { status: 404 });

        return NextResponse.json({ jobs: company.jobPosts });
    } catch (err) {
        console.error("GET /job error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
