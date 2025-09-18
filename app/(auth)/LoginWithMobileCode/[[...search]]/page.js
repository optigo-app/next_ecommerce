import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const LoginWithMobileCode = (await import(`@/app/theme/${theme}/Auth/LoginWithMobileCode/page.js`)).default;
  return <LoginWithMobileCode params={params} searchParams={searchParams} />;
};

export default page;
