import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = `https://api.unsplash.com/search/photos?query=career,hiring,teamwork,office&per_page=30&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`;

    const res = await fetch(url, {
        headers: {
            "Accept-Version": "v1",
        },
    });

    const data = await res.json();
    return NextResponse.json(data);
}
