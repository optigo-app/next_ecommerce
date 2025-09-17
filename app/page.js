import { getActiveTheme } from "./(core)/lib/getActiveTheme";

export default async function Page() {
  const theme = await getActiveTheme();
  const Home = (await import(`@/app/theme/${theme}/home/page.jsx`)).default;
  return <Home />;
}
