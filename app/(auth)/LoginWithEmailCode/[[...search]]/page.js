import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

export const themeMap = {
  "fgstore.web": {
    page: "fgstore.web",
  },
  "astore.orail.co.in": {
    page: "fgstore.web",
  },
  // Add more themes as needed
};

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const LoginWithEmailCode = (await import(`@/app/theme/${themeData.page}/Auth/LoginWithEmailCode/page.js`)).default;
  return <LoginWithEmailCode params={params} searchParams={searchParams} />;
};

export default page;
