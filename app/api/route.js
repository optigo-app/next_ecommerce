// app/api/cookies/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function GET() {
    const cookieStore = cookies();
    const visitorId = cookieStore.get("visitorId")?.value ?? null;
    const userToken = cookieStore.get("userLoginCookie")?.value ?? null;

    const all = cookieStore.getAll();
    const map = Object.fromEntries(all.map(c => [c.name, c.value]));

    return NextResponse.json({ visitorId, userToken, cookies: map });
}
