import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

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
  
  const Appointment = (await import(`@/app/theme/${themeData.page}/appointment/page.js`)).default;
  return <Appointment assetBase={assetBase} />;
}
