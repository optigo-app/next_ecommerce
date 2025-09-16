import { Poppins } from "next/font/google";
import "./globals.css";
import { pages } from "@/utils/pages";
import { generatePageMetadata } from "@/utils/HeadMeta";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = generatePageMetadata(pages['/']);

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
