import { getActiveTheme } from "./(core)/lib/getActiveTheme";

export const themeMap = {
  "fgstore.web": {
    page: "fgstore.web",
  },
  "sonasons.optigoapps.com": {
    page: "fgstore.web",
  },
};

export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Home = (await import(`@/app/theme/${themeData.page}/home/page.jsx`)).default;
  return <Home />;
}
