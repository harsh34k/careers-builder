import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const prisma = new PrismaClient
const JWT_SECRET = "superman@123$"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) return NextResponse.json({ error: "input field are not correct" }, { status: 400 })

        const user = await prisma.recruiter.findFirst({
            where: {
                email
            }
        })
        console.log("user", user);

        if (!user) return NextResponse.json({ error: "User does not exists" }, { status: 404 })
        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })
        const response = NextResponse.json({ message: "Login successful", token });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
        });

        return response;
    } catch (error) {
        console.log("error", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}