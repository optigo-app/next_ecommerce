import { NEXT_APP_WEB } from "./env";

export async function fetchStoreInitData() {
    try {
        let baseUrl;

        if (typeof window !== "undefined") {
            // ✅ Client-side: detect from browser URL
            let { protocol, hostname, port } = window.location;

            // Remove "www." prefix if exists
            if (hostname.startsWith("www.")) {
                hostname = hostname.substring(4);
            }

            // If running locally, fallback to NEXT_APP_WEB
            if (
                hostname === "localhost" ||
                hostname === "127.0.0.1" ||
                hostname === "zen"
            ) {
                // baseUrl = `${protocol}//${NEXT_APP_WEB}${port ? `:${port}` : ""}`;
                baseUrl = `${protocol}//${NEXT_APP_WEB}`;
            } else {
                baseUrl = `${protocol}//${NEXT_APP_WEB}`;
            }
        } else {
            // ✅ Server-side (Next.js SSR)
            const devHost = process.env.HOST || "localhost";
            const devPort = process.env.PORT || "3000"; // can be overridden
            const protocol =
                process.env.NODE_ENV === "development" ? "http:" : "https:";

            if (process.env.NODE_ENV === "development") {
                // baseUrl = `${protocol}//${NEXT_APP_WEB}:${devPort}`;
                baseUrl = `${protocol}//${NEXT_APP_WEB}`;
            } else {
                baseUrl = NEXT_APP_WEB;
            }
        }

        const staticPath = `${baseUrl}/Website_Store/WebSiteStaticImage/${NEXT_APP_WEB}`;
        const response = await fetch(`${staticPath}/StoreInit.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        return jsonData || null;
    } catch (error) {
        console.error("Error fetching StoreInit data:", error);
        return null;
    }
}
