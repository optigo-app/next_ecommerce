import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export default async function Page() {
  const theme = await getActiveTheme();
  const PrivacyPolicy = (await import(`@/app/theme/${theme}/privacyPolicy/page.js`)).default;
  return <PrivacyPolicy />;
}
