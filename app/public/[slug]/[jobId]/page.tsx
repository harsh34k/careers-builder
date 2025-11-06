import JobDetailsPage from "@/app/components/JobDetails"
import verifyJWT from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../../generated/prisma/client";
const prisma = new PrismaClient()
export default async function PreviewPage({ params }: any) {
    const token = await cookies()
    const data = token.get("token")?.value;
    if (!data) redirect("/login");
    const decoded = verifyJWT(data);
    const user = await prisma.recruiter.findUnique({
        where: { id: decoded.id },
        include: { company: true }
    });

    if (!user || (user.company?.isPublished == false))
        redirect("/dashboard")
    return <JobDetailsPage params={params} />
}