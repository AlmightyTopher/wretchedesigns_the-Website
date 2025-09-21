import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Wretched Designs",
    description: "Custom Printed Apparel · Art & Relics · Nightlife For The Unrepentant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-matte-black text-white antialiased">
        <div className="max-w-7xl mx-auto">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
