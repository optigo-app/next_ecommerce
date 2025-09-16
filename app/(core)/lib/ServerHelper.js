import { headers } from "next/headers";
import { NEXT_APP_WEB } from "../utils/env";

const headersList = headers();
const host = headersList.get("host");

function getProtocol(host) {
  if (!host) return "http";
  return host.includes("localhost") ? "http" : "https";
}

function storImagePath(host) {
  const protocol = getProtocol(host);
  const base = host.includes("localhost") || host.includes("zen") ? NEXT_APP_WEB : host;
  return `${protocol}://${base}/WebSiteStaticImage`;
}

const assetBase = storImagePath(host);

export { getProtocol, storImagePath, assetBase };
