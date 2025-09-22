import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function Page() {
    const theme = await getActiveTheme();
    const storeInit = await getStoreInit();
    const Payment = (await import(`@/app/theme/${theme}/payment/page.jsx`)).default;
    return <Payment storeInit={storeInit} />;
}
