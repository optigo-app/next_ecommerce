import { Poppins } from "next/font/google";
import "./globals.css";
import { pages } from "@/app/(core)/utils/pages";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";
import { MasterProvider } from "@/app/(core)/contexts/MasterProvider";
import { getCompanyInfoData, getStoreInit } from "./(core)/utils/GlobalFunctions/GlobalFunctions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = generatePageMetadata(pages["/"]);

export default async function RootLayout({ children }) {
  const companyInfo = await getCompanyInfoData();
  const storeInit = await getCompanyInfoData();
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <MasterProvider getCompanyInfoData={companyInfo} getStoreInit={storeInit}>{children}</MasterProvider>
      </body>
    </html>
  );
}
