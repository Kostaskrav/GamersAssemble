import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "GamersAssemble",
  description:
    "A dark, modern forum for gamers to report bugs, share fixes, and pitch ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${syne.variable}`}>
        <AppProviders>
          <div className="relative min-h-screen">
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
