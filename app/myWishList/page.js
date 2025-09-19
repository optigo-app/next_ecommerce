import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export default async function Page() {
  const theme = await getActiveTheme();
    const storeInit = await getStoreInit();
  const Wishlist = (await import(`@/app/theme/${theme}/Wishlist/page.js`)).default;
  return <Wishlist storeInit={storeInit} />;
}
