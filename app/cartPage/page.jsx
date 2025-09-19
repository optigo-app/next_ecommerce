import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export default async function Page({ params, searchParams }) {
    const theme = await getActiveTheme();
    const Cart = (await import(`@/app/theme/${theme}/cart/page.jsx`)).default;
    return <Cart params={params} searchParams={searchParams} />;
}
