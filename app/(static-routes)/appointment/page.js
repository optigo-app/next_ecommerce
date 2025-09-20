import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

export default async function Page() {
  const theme = await getActiveTheme();
  
  const Appointment = (await import(`@/app/theme/${theme}/appointment/page.js`)).default;
  return <Appointment assetBase={assetBase} />;
}
