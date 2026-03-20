import type { Metadata } from "next";
import { Merriweather, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import Navbar from "@/components/Navbar";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BUNA | Premium Ethiopian Specialty Coffee",
  description: "Experience the authentic taste of hand-roasted Ethiopian coffee, sourced directly from the heart of Addis Ababa.",
};

import GlobalCursor from '@/components/GlobalCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${merriweather.variable} ${poppins.variable} antialiased`}>
      <body className="bg-[#FAF7F2] antialiased" suppressHydrationWarning>
        <SmoothScroll>
          <Navbar />
          <CheckoutDrawer />
          {children}
        </SmoothScroll>
        <GlobalCursor />
      </body>
    </html>
  );
}
