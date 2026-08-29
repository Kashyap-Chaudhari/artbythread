import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Navbar } from "@/components/layout/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { ThreadCursor } from "@/components/ui/ThreadCursor";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const handwritingFont = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArtByThread.7 | Handmade Thread Art, Crochet Flowers & Bespoke Gifts",
  description:
    "Artisanal thread studio crafting bespoke embroidery hoops, everlasting crochet flower bouquets, bag charms, keychains, and personalized gifts. Handcrafted with heart, one thread at a time.",
  openGraph: {
    title: "ArtByThread.7 — Made by Thread. Made with Heart.",
    description:
      "Explore bespoke embroidery hoops, forever crochet flower bouquets, bag charms, and personalized gifts. Order directly on WhatsApp or Instagram.",
    url: "https://artbythread.com",
    siteName: "ArtByThread.7",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${handwritingFont.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F1D1B] antialiased selection:bg-[#F8D7DA] selection:text-[#C84B31]">
        <StoreProvider>
          {/* Subtle Desktop Thread Cursor */}
          <ThreadCursor />

          {/* Sticky Navbar & Integrated Announcement Banner */}
          <Navbar />

          {/* Search Command Modal */}
          <SearchOverlay />

          {/* Main Application Page */}
          <main className="flex-1 w-full flex flex-col">{children}</main>

          {/* Floating WhatsApp Action */}
          <FloatingWhatsApp />
        </StoreProvider>
      </body>
    </html>
  );
}
