import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function Page() {
  const theme = await getActiveTheme();
    const storeInit = await getStoreInit();
  const Lookbook = (await import(`@/app/theme/${theme}/Lookbook/page.js`)).default;
  return <Lookbook storeInit={storeInit} />;
}
