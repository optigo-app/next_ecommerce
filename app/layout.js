import { Poppins } from "next/font/google";
import "./globals.css";
import { pages } from "@/app/(core)/utils/pages";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { MasterProvider } from "@/app/(core)/contexts/MasterProvider";
import { getCompanyInfoData, getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";
import { getActiveTheme } from "./(core)/lib/getActiveTheme";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = generatePageMetadata(pages["/"]);

export default async function RootLayout({ children }) {
  const theme = await getActiveTheme();
  const Layout = (await import(`@/app/theme/${theme}/layout.jsx`)).default;
  const companyInfo = await getCompanyInfoData();
  const storeInit = await getStoreInit();
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <MasterProvider getCompanyInfoData={companyInfo} getStoreInit={storeInit}>
          <Layout>
            {children}
          </Layout>
        </MasterProvider>
      </body>
    </html>
  );
}
