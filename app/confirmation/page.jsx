import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function Page() {
    const theme = await getActiveTheme();
    const storeInit = await getStoreInit();
    const Confirmation = (await import(`@/app/theme/${theme}/confirmation/page.jsx`)).default;
    return <Confirmation storeInit={storeInit} />;
}
