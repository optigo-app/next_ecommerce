import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export default async function Page() {
  const theme = await getActiveTheme();
  
  const BespokeJewelry = (await import(`@/app/theme/${theme}/bespoke-jewelry/page.js`)).default;
  return <BespokeJewelry assetBase={assetBase} />;
}
