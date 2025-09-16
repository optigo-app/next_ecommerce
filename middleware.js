import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

// Define the mapping of domains to store configs
const domainMap = {
    "localhost": NEXT_APP_WEB,
};

export default async function middleware(req) {
    const host = req.headers.get("host"); // e.g., fgstore.pro or localhost:3000
    const storeName = domainMap[host] || NEXT_APP_WEB;
    // Pass the store name into your fetch function if needed
    const storeData = await fetchStoreInitData(storeName);

    const response = NextResponse.next();

    // Set the storeData in headers (for client/server use)
    response.headers.set("x-store-data", JSON.stringify(storeData));

    // Optional: Also set as a cookie
    response.cookies.set("store-data", JSON.stringify(storeData), {
        httpOnly: false,
        path: "/",
    });

    return response;
}

// Match all paths or specific ones
export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
