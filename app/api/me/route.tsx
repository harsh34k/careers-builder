import verifyJWT from "@/lib/jwt"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const token = request.headers.get("cookie")?.split("token=")[1]?.split(";")[0]
        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 })
        }
        const decodedToken = verifyJWT(token);
        const user = await prisma.recruiter.findFirst({
            where: {
                id: decodedToken.id
            },
            include: { company: true }
        })
        return NextResponse.json({ user })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ user: null }, { status: 401 });
    }
}