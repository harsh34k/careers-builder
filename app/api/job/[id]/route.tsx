import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import verifyJWT from "@/lib/jwt";

const prisma = new PrismaClient()

interface Params {
    params: Promise<{ id: string }>;
}

// GET a single job by id
export async function GET(req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({
            where: { id },
        });

        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        return NextResponse.json({ job });
    } catch (err) {
        console.error("GET /job/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);
        const body = await req.json();

        const company = await prisma.company.findFirst({
            where: { recruiterId: decoded.id },
        });

        if (!company)
            return NextResponse.json({ error: "No company found" }, { status: 404 });

        // ensure job belongs to company
        const job = await prisma.job.findUnique({ where: { id } });
        if (!job || job.companyId !== company.id)
            return NextResponse.json({ error: "Unauthorized job update" }, { status: 403 });

        const updateData = Object.fromEntries(
            Object.entries(body).filter(([_, v]) => v !== undefined)
        );

        const updatedJob = await prisma.job.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ job: updatedJob });
    } catch (err) {
        console.error("PATCH /job/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);

        const company = await prisma.company.findFirst({
            where: { recruiterId: decoded.id },
        });

        const job = await prisma.job.findUnique({ where: { id } });
        if (!job || job.companyId !== company?.id)
            return NextResponse.json({ error: "Unauthorized delete" }, { status: 403 });

        await prisma.job.delete({ where: { id } });

        return NextResponse.json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error("DELETE /job/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
