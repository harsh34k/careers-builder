// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import verifyJWT from "@/lib/jwt"; // ✅ named import

export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Protect dashboard + preview
    if (
        pathname.startsWith("/preview")
    ) {
        const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
        console.log("token", token)

        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            verifyJWT(token); // ✅ if valid → allow
            return NextResponse.next();
        } catch (err) {
            const res = NextResponse.redirect(new URL("/login", req.url));
            console.log("you are not allowed");

            res.cookies.set("token", "", { maxAge: 0 }); // ✅ clear cookie
            return res;
        }
    }

    return NextResponse.next();
}

// ✅ Apply middleware to necessary routes
export const config = {
    matcher: [
        "/preview/:path*",
    ],
};
