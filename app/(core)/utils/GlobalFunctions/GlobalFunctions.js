import { headers } from "next/headers";

export const getStoreInit = async () => {
    const headersList = await headers();
    const storeData = JSON.parse(headersList.get("x-store-data") || "{}");
    return storeData;
}