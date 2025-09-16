import { getActiveTheme } from "./(core)/lib/getActiveTheme";

export default async function Page() {
  const theme = getActiveTheme();
  const Product = (await import(`@/app/theme/${theme}/home/page.jsx`)).default;
  return <Product />;
}
