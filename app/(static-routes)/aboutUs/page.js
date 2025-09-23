import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export const themeMap = {
  "fgstore.web": {
    page: "fgstore.web",
  },
  "astore.orail.co.in": {
    page: "fgstore.web",
  },
  // Add more themes as needed
};

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const AboutUs = (await import(`@/app/theme/${themeData.page}/AboutUs/page.js`)).default;
  return <AboutUs />;
}
