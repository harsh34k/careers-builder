import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { PrismaClient } from "../../generated/prisma/client"
import verifyJWT from "@/lib/jwt";
const prisma = new PrismaClient()
export async function POST(req: Request) {
    try {

        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const decoded = verifyJWT(token);


        const formData = await req.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // "logo" or "cover"

        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const uploaded = await cloudinary.uploader.upload(base64, {
            folder: "career_pages",
            resource_type: "auto",
        });

        const imageUrl = uploaded.secure_url;

        const recruiter = await prisma.recruiter.findUnique({
            where: { id: decoded.id },
            include: { company: true },
        });

        if (!recruiter?.company)
            return NextResponse.json({ error: "Company not found" }, { status: 404 });

        const updatedCompany = await prisma.company.update({
            where: { id: recruiter.company.id },
            data:
                type === "cover"
                    ? { bannerUrl: imageUrl }
                    : { logoUrl: imageUrl },
        });

        return NextResponse.json({
            success: true,
            imageUrl,
            company: updatedCompany,
        });
    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Upload failed", details: err.message }, { status: 500 });
    }
}
