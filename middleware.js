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
    response.cookies.set("x-store-data", JSON.stringify(storeData?.rd[0]), {
        httpOnly: false,
        path: "/",
    });
    response.cookies.set("x-myAccountFlags-data", JSON.stringify(storeData?.rd1), {
        httpOnly: false,
        path: "/",
    });
    response.cookies.set("x-CompanyInfoData-data", JSON.stringify(storeData?.rd2[0]), {
        httpOnly: false,
        path: "/",
    });

    return response;
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
