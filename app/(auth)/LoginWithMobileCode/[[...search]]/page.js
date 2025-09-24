import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

export const themeMap = {
  "fgstore.web": {
    page: "fgstore.web",
  },
  "sonasons.optigoapps.com": {
    page: "fgstore.web",
  },
  // Add more themes as needed
};


const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const LoginWithMobileCode = (await import(`@/app/theme/${themeData.page}/Auth/LoginWithMobileCode/page.js`)).default;
  return <LoginWithMobileCode params={params} searchParams={searchParams} />;
};

export default page;
