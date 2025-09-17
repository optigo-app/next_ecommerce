import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const ContinueWithEmail = (await import(`@/app/theme/${theme}/Auth/ContinueWithEmail/page.js`)).default;
  return <ContinueWithEmail params={params} searchParams={searchParams} />;
};

export default page;
