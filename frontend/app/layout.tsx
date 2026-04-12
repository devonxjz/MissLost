import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientShell from "@/app/components/ClientShell";
import RouteGuard from "@/app/components/RouteGuard";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MissLost - Hệ thống tìm kiếm vật phẩm thất lạc",
  description: "Cộng đồng hỗ trợ tìm kiếm và trao trả vật phẩm thất lạc thông minh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full bg-[#f5f6fc]">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased text-[#2c2f33] bg-[#f5f6fc] min-h-screen selection:bg-[#caceff]/60`}
      >
        <RouteGuard>
          <ClientShell>{children}</ClientShell>
        </RouteGuard>
      </body>
    </html>
  );
}
