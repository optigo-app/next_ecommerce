import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import React from "react";

const page = async ({ params, searchParams }) => {
  const theme = await getActiveTheme();
  const Register = (await import(`@/app/theme/${theme}/Auth/Register/page.js`)).default;
  return <Register params={params} searchParams={searchParams} />;
};

export default page;
