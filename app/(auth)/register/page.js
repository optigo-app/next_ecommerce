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
  const Register = (await import(`@/app/theme/${themeData.page}/Auth/Register/page.js`)).default;
  return <Register params={params} searchParams={searchParams} />;
};

export default page;
