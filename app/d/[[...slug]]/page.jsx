import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export default async function Page({ params, searchParams }) {
    const theme = await getActiveTheme();
    const Detail = (await import(`@/app/theme/${theme}/detail/page.jsx`)).default;
    return <Detail params={params} searchParams={searchParams} />;
}
