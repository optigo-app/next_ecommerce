import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const ForgotPassword = (await import(`@/app/theme/${theme}/Auth/ForgotPassword/page.js`)).default;
  return <ForgotPassword params={params} searchParams={searchParams} />;
};

export default page;
