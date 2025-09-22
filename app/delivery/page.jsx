import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function Page() {
    const theme = await getActiveTheme();
    const storeInit = await getStoreInit();
    const Delivery = (await import(`@/app/theme/${theme}/delivery/page.jsx`)).default;
    return <Delivery storeInit={storeInit} />;
}
