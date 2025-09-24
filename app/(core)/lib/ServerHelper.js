// app/(core)/lib/ServerHelper.js
import { headers } from "next/headers";
import { NEXT_APP_WEB } from "../utils/env";

/**
 * Safe host getter (server only).
 */
export async function getHost() {
  try {
    const headersList = await headers(); // only works in server request scope
    return headersList.get("host") || "localhost:3000";
  } catch {
    // fallback for client side or when headers() is not available
    if (typeof window !== "undefined") {
      return window.location.host;
    }
    return "localhost:3000";
  }
}

export function getProtocol(host) {
  if (!host) return "http";
<<<<<<< HEAD
  return host.includes("localhost") ? "https" : "https";
=======
  return host.includes("localhost") ? "http" : "https";
>>>>>>> ea07f93730859a23fc1049e23e79e0ce0b8f4332
}

export function storImagePath(host) {
  const protocol = getProtocol(host);
  const base = host.includes("localhost") || host.includes("zen") ? NEXT_APP_WEB : host;
  return `${protocol}://${base}/WebSiteStaticImage`;
}

/**
 * ✅ Keep assetBase export, but compute lazily
 * so it never breaks on module load.
 */
export async function getAssetBase() {
  const host = await getHost();
  return storImagePath(host);
}

// alias for backward compatibility
export const assetBase = await getAssetBase();

export async function getLogos() {
  const base = await getAssetBase();
  return {
    web: `${base}/logoIcon/webLogo.png`,
    mobile: `${base}/logoIcon/mobileLogo.png`,
  };
}
