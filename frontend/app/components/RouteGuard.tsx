"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserRole from "@/app/hooks/useUserRole";

const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];
const ADMIN_PREFIX = "/admin";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useUserRole();

  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (role === undefined) return; // Still loading

    if (role === "admin") {
      // 1. Admin users: ONLY access /admin/ routes and /settings
      const ALLOWED_ADMIN_ROUTES = [ADMIN_PREFIX, "/settings"];
      const isAllowed = ALLOWED_ADMIN_ROUTES.some(route => pathname.startsWith(route));
      
      if (!isAllowed) {
        router.replace("/admin/admin-overview");
      } else if (pathname === "/admin") {
        router.replace("/admin/admin-overview");
      }
    } else {
      // 2. Non-admin users: Blocked from /admin/ routes
      if (pathname.startsWith(ADMIN_PREFIX)) {
        router.replace(role === null ? "/auth/login" : "/feeds");
      }
      
      // Prevent logged-in general users from visiting auth pages again
      if (role !== null && isAuthPage) {
        router.replace("/feeds");
      }
    }
  }, [role, pathname, router, isAuthPage]);

  // Wait until role is determined to avoid UI flashing
  if (role === undefined) return null;

  // Prevent rendering incorrect layouts during redirection
  // Allow admins to access /admin/* and /settings
  if (role === "admin") {
    const ALLOWED_ADMIN_ROUTES = [ADMIN_PREFIX, "/settings"];
    const isAllowed = ALLOWED_ADMIN_ROUTES.some(route => pathname.startsWith(route));
    if (!isAllowed) return null;
  }
  
  if (role !== "admin" && pathname.startsWith(ADMIN_PREFIX)) return null;
  if (role !== null && role !== "admin" && isAuthPage) return null;

  return <>{children}</>;
}
