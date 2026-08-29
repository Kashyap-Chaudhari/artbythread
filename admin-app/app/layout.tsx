import type { Metadata } from "next";
import "./globals.css";
import { AdminStoreProvider } from "@/lib/store";
import { AdminShell } from "@/components/layout/AdminShell";

export const metadata: Metadata = {
  title: "ArtByThread.7 Studio — Admin Portal",
  description: "Internal studio operations, 5-stage order management, courier tracking, and creation catalog for ArtByThread.7.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF7F2] text-[#1F1D1B] antialiased min-h-screen">
        <AdminStoreProvider>
          <AdminShell>{children}</AdminShell>
        </AdminStoreProvider>
      </body>
    </html>
  );
}
