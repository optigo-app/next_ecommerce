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
  const LoginWithEmailCode = (await import(`@/app/theme/${themeData.page}/Auth/LoginWithEmailCode/page.js`)).default;
  return <LoginWithEmailCode params={params} searchParams={searchParams} />;
};

export default page;
