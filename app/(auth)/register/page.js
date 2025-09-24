import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

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

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Register = (await import(`@/app/theme/${themeData.page}/Auth/Register/page.js`)).default;
  return <Register params={params} searchParams={searchParams} />;
};

export default page;
