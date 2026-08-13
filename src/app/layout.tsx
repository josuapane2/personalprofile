import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PublicMain from "@/components/PublicMain";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Josua Pane | Sales & Data Analyst",
  description:
    "Sales and data analyst specializing in retail analytics, reporting automation, dashboard development, and actionable business insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${lora.variable} ${plusJakartaSans.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <PublicMain>{children}</PublicMain>
        <Footer />
      </body>
    </html>
  );
}
