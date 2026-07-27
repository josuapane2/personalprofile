import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PublicMain from "@/components/PublicMain";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <PublicMain>{children}</PublicMain>
        <Footer />
      </body>
    </html>
  );
}
