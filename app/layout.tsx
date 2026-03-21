import type { Metadata } from "next";
import { Merriweather, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import Navbar from "@/components/Navbar";
import GlobalCursor from '@/components/GlobalCursor';
import Preloader from '@/components/Preloader';

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

// Task 74: Elite SEO & Social Graph Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://ethiopian-coffee-brand-w9sf.vercel.app'), // Live Vercel URL
  title: {
    default: 'Kaffa Roasters | Specialty Coffee from Addis Ababa',
    template: '%s | Kaffa Roasters',
  },
  description: 'Experience the birthplace of coffee. Kaffa Roasters delivers premium, sustainably sourced specialty coffee directly from the Ethiopian highlands to the world.',
  keywords: ['specialty coffee', 'Ethiopian coffee', 'coffee roasters', 'Addis Ababa', 'Kaffa biosphere', 'single origin', 'hand roasted', 'Buna'],
  authors: [{ name: 'Kaffa Roasters' }],
  creator: 'Kaffa Roasters',
  openGraph: {
    title: 'Kaffa Roasters | The Origin of Coffee',
    description: 'Experience the birthplace of coffee. Premium specialty coffee from Addis Ababa.',
    url: 'https://ethiopian-coffee-brand-w9sf.vercel.app',
    siteName: 'Kaffa Roasters',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kaffa Roasters — Premium Ethiopian Specialty Coffee',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaffa Roasters | Specialty Coffee',
    description: 'Experience the birthplace of coffee from the Ethiopian highlands.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Schema for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'Kaffa Roasters',
    image: 'https://ethiopian-coffee-brand-w9sf.vercel.app/og-image.jpg',
    description: 'Premium specialty coffee roasted in Addis Ababa, sourced directly from the Kaffa Biosphere.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
    },
    priceRange: '$$',
    url: 'https://ethiopian-coffee-brand-w9sf.vercel.app',
  };

  return (
    <html lang="en" className={`${merriweather.variable} ${poppins.variable} antialiased`}>
      <body className="bg-[#FAF7F2] antialiased" suppressHydrationWarning>
        <Preloader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
