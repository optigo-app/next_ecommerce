import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export default async function Page({ params, searchParams }) {
  const theme = getActiveTheme();
  const Product = (await import(`@/app/theme/${theme}/product/page.jsx`)).default;
  return <Product params={params} searchParams={searchParams} />;
}
