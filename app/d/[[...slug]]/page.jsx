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
      const Detail = (await import(`@/app/theme/${themeData.page}/detail/page.jsx`)).default;
      return <Detail params={params} searchParams={searchParams} />;
}
