import { PrismaClient } from "../../../generated/prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { email, password, company } = await request.json()
        if (!email || !password) return NextResponse.json({ error: "input field are not correct" }, { status: 400 })
        const existingUser = await prisma.recruiter.findMany({
            where: {
                email
            }
        })
        if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 401 })
        const hashedPass = await bcrypt.hash(password, 10)
        const user = prisma.recruiter.create({
            data: {
                email,
                password: hashedPass,
                company
            }
        })
        return NextResponse.json({ message: "User succussefully created" }, { status: 200 })
    } catch (error) {
        console.log("error", error)
        return NextResponse.json({ message: "Error creating user" }, { status: 500 })
    }
}