import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { getStoreInit } from "../(core)/utils/GlobalFunctions/GlobalFunctions";

export const themeMap = {
    "fgstore.web": {
      page: "fgstore.web",
    },
<<<<<<< HEAD
    "sonasons.optigoapps.com": {
=======
    "astore.orail.co.in": {
>>>>>>> ea07f93730859a23fc1049e23e79e0ce0b8f4332
      page: "fgstore.web",
    },
    // Add more themes as needed
  };
  export default async function Page() {
      const theme = await getActiveTheme();
      const themeData = themeMap[theme];
      const storeInit = await getStoreInit();
      const Payment = (await import(`@/app/theme/${themeData.page}/payment/page.jsx`)).default;
      return <Payment storeInit={storeInit} />;
}
