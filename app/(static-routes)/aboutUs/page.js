import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export default async function Page() {
  const theme = await getActiveTheme();
  const AboutUs = (await import(`@/app/theme/${theme}/AboutUs/page.js`)).default;
  return <AboutUs />;
}
