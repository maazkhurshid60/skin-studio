import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skin Studio Ithaca | Luxury Medical Spa & Skincare Clinic",
  description:
    "Serious skincare. Serious results. Skin Studio Ithaca is a premium medi spa offering advanced facial treatments, laser hair removal, micro-infusion facials, and more in Ithaca, New York.",
  keywords: [
    "med spa Ithaca",
    "facial treatments Ithaca NY",
    "laser hair removal",
    "micro-infusion facial",
    "skincare clinic",
    "medical spa",
    "Skin Studio Ithaca",
  ],
  openGraph: {
    title: "Skin Studio Ithaca | Luxury Medical Spa",
    description:
      "Medical-grade skin solutions in a relaxing atmosphere. Advanced treatments, personalized care, lasting results.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
