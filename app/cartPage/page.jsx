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
  export default async function Page({ params, searchParams }) {
    const theme = await getActiveTheme();
    const themeData = themeMap[theme];
    const Cart = (await import(`@/app/theme/${themeData.page}/cart/page.jsx`)).default;
    return <Cart params={params} searchParams={searchParams} />;
}
