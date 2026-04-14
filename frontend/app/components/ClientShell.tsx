"use client";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import SideNavBar from "@/app/components/SideNavBar";
import AdminSideNavBar from "@/app/components/AdminSideNavBar";
import useUserRole from "@/app/hooks/useUserRole";

const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = useUserRole();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  
  // Show Admin Sidebar if the user is an admin
  const isAdmin = role === "admin";
  const isUser = role === "user";
  const isAdminPath = pathname.startsWith("/admin");

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Determine which sidebar to show
  // We wait for role to be determined to avoid showing the wrong sidebar (flickering)
  const renderSidebar = () => {
    if (role === undefined) return <div className="w-72 shrink-0" />; // Placeholder while loading
    if (isAdmin || isAdminPath) return <AdminSideNavBar />;
    return <SideNavBar />;
  };

  return (
    <>
      <Header />
      <div className="flex pt-16 px-6 gap-6 max-w-[1600px] mx-auto min-h-screen" style={{ backgroundColor: "var(--color-bg-primary)" }}>
        {renderSidebar()}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </>
  );
}