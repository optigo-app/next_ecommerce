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
  const ForgotPassword = (await import(`@/app/theme/${themeData.page}/Auth/ForgotPassword/page.js`)).default;
  return <ForgotPassword params={params} searchParams={searchParams} />;
};

export default page;
