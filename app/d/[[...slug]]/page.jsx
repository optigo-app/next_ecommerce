import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export const themeMap = {
    "fgstore.web": {
      page: "fgstore.web",
    },
<<<<<<< HEAD
    "sonasons.optigoapps.com": {
=======
    "astore.orail.co.in": {
>>>>>>> ea07f93730859a23fc1049e23e79e0ce0b8f4332
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
