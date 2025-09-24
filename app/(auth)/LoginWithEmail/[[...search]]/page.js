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
  const LoginWithEmail = (await import(`@/app/theme/${themeData.page}/Auth/LoginWithEmail/page.js`)).default;
  return <LoginWithEmail params={params} searchParams={searchParams} />;
};

export default page;
