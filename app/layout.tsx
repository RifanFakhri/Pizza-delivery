import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mamah Faqih | Fine Dining Pizza & Delivery",
  description: "Experience the ultimate artisanal pizza. Crafted with tradition, delivered with love since 2010. Order your gourmet dinner today.",
  keywords: ["pizza delivery", "fine dining pizza", "artisanal pizza", "jakarta pizza", "mamah faqih"],
  openGraph: {
    title: "Mamah Faqih | Fine Dining Pizza & Delivery",
    description: "The best artisanal pizza in Jakarta. Crafted with tradition, delivered with love.",
    url: "https://pizza-delivery-8qjx.vercel.app",
    siteName: "Mamah Faqih Pizza",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mamah Faqih Gourmet Pizza",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mamah Faqih | Fine Dining Pizza & Delivery",
    description: "The best artisanal pizza in Jakarta. Crafted with tradition, delivered with love.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
