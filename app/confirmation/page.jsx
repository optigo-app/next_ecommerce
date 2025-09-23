import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export const themeMap = {
    "fgstore.web": {
      page: "fgstore.web",
    },
    "astore.orail.co.in": {
      page: "fgstore.web",
    },
    // Add more themes as needed
  };
  
  export default async function Page() {
      const theme = await getActiveTheme();
      const themeData = themeMap[theme];
      const storeInit = await getStoreInit();
      const Confirmation = (await import(`@/app/theme/${themeData.page}/confirmation/page.jsx`)).default;
    return <Confirmation storeInit={storeInit} />;
}
