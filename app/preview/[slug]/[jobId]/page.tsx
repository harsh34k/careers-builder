import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import verifyJWT from "@/lib/jwt";
import { PrismaClient } from "@prisma/client";

import JobDetailsPage from "@/app/components/JobDetails";
const prisma = new PrismaClient();

export default async function PreviewPage({ params }: any) {
    const { slug } = await params
    const token = await cookies()
    const data = token.get("token")?.value;
    if (!data) redirect("/login");

    const decoded = verifyJWT(data);

    const user = await prisma.recruiter.findUnique({
        where: { id: decoded.id },
        include: { company: true }
    });

    if (!user || !user.company) redirect("/dashboard");

    if (user.company.slug !== slug) {
        redirect(`/preview/${user.company.slug}`);
    }

    return <JobDetailsPage params={params} />;
}
