import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const LoginWithEmailCode = (await import(`@/app/theme/${theme}/Auth/LoginWithEmailCode/page.js`)).default;
  return <LoginWithEmailCode params={params} searchParams={searchParams} />;
};

export default page;
