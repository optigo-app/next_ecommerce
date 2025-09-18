import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const LoginWithEmail = (await import(`@/app/theme/${theme}/Auth/LoginWithEmail/page.js`)).default;
  return <LoginWithEmail params={params} searchParams={searchParams} />;
};

export default page;
