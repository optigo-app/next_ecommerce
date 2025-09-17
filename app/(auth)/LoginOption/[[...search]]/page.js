import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const LoginOption = (await import(`@/app/theme/${theme}/Auth/LoginOption/page.js`)).default;
  return <LoginOption params={params} searchParams={searchParams} />;
};

export default page;
