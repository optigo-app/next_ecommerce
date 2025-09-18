import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const ContinueWithMobile = (await import(`@/app/theme/${theme}/Auth/ContinueWithMobile/page.js`)).default;
  return <ContinueWithMobile params={params} searchParams={searchParams} />;
};

export default page;
