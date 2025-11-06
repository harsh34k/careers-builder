import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import verifyJWT from "@/lib/jwt";

// const prisma = new PrismaClient()
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);
        const body = await req.json();

        const { name, slug, description } = body;

        const existing = await prisma.company.findFirst({
            where: { recruiter: { id: decoded.id } },
        });

        if (existing)
            return NextResponse.json({ error: "Company already exists" }, { status: 400 });

        const company = await prisma.company.create({
            data: {
                name,
                slug,
                description,
                sections: [],
                recruiter: { connect: { id: decoded.id } },
            },
        });

        return NextResponse.json({ company }, { status: 201 });
    } catch (err) {
        console.error("POST /company error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);

        const company = await prisma.company.findFirst({
            where: { recruiter: { id: decoded.id } },
            include: { jobPosts: true },
        });

        if (!company)
            return NextResponse.json({ message: "No company found" }, { status: 404 });

        return NextResponse.json({ company });
    } catch (err) {
        console.error("GET /company error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyJWT(token);
        const body = await req.json();

        // find recruiter + company
        const recruiter = await prisma.recruiter.findUnique({
            where: { id: decoded.id },
            include: { company: true },
        });

        if (!recruiter?.company)
            return NextResponse.json({ error: "Company not found" }, { status: 404 });

        const updateData: { name?: string; slug?: string; description?: string } = Object.fromEntries(
            Object.entries(body).filter(([_, value]) => value !== undefined)
        );
        if (updateData.slug && updateData.slug !== recruiter.company.slug) {
            const slugExists = await prisma.company.findUnique({
                where: { slug: updateData.slug },
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: "Slug already in use. Please choose another." },
                    { status: 400 }
                );
            }
        }

        const updatedCompany = await prisma.company.update({
            where: { id: recruiter.company.id },
            data: updateData,
        });

        return NextResponse.json({ company: updatedCompany });
    } catch (err) {
        console.error("PATCH /company error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
