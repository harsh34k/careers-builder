import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client"

const prisma = new PrismaClient()

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = await params;
        const company = await prisma.company.findUnique({
            where: { slug },
            include: {
                jobPosts: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!company) {
            return NextResponse.json(
                { error: "Company not found or not published" },
                { status: 404 }
            );
        }
        const publicData = {
            id: company.id,
            name: company.name,
            slug: company.slug,
            logoUrl: company.logoUrl,
            bannerUrl: company.bannerUrl,
            themeColor: company.themeColor,
            videoUrl: company.videoUrl,
            description: company.description,
            sections: company.sections,
            createdAt: company.createdAt,
            jobs: company.jobPosts.map((job) => ({
                id: job.id,
                title: job.title,
                description: job.description,
                location: job.location,
                jobType: job.jobType,
                createdAt: job.createdAt,
            })),
        };

        return NextResponse.json(publicData, { status: 200 });
    } catch (err) {
        console.error("Error fetching public company data:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
