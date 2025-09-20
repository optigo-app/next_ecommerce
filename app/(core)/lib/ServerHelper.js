// app/(core)/lib/ServerHelper.js
import { headers } from "next/headers";
import { NEXT_APP_WEB } from "../utils/env";

/**
 * Safe host getter (server only).
 */
export function getHost() {
  try {
    const headersList = headers(); // only works in server request scope
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
  return host.includes("localhost") ? "http" : "https";
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
export function getAssetBase() {
  const host = getHost();
  return storImagePath(host);
}

// alias for backward compatibility
export const assetBase = getAssetBase();

export function getLogos() {
  const base = getAssetBase();
  return {
    web: `${base}/logoIcon/webLogo.png`,
    mobile: `${base}/logoIcon/mobileLogo.png`,
  };
}
