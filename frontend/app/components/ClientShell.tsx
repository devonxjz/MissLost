"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import SideNavBar from "@/app/components/SideNavBar";

const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex pt-16 px-6 gap-6 max-w-[1600px] mx-auto">
        <SideNavBar />
        {children}
      </div>
    </>
  );
}
