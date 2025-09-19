import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";

export default async function Page() {
  const theme = await getActiveTheme();
  const ContactUs = (await import(`@/app/theme/${theme}/contactUs/page.js`)).default;
  return <ContactUs />;
}
