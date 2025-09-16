import { Poppins } from "next/font/google";
import "./globals.css";
import { pages } from "@/app/(core)/utils/pages";
import { generatePageMetadata } from "@/app/(core)/utils/HeadMeta";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = generatePageMetadata(pages["/"]);

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>{children}</body>
    </html>
  );
}
