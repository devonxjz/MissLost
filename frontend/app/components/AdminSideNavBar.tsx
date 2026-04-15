"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const adminNavItems = [
  { href: "/admin/admin-overview", icon: "dashboard", label: "Tổng quan" },
  { href: "/admin/post-management", icon: "article", label: "Quản lý bài đăng" },
  { href: "/admin/user-management", icon: "group", label: "Quản lý người dùng" },
  { href: "/admin/training-points", icon: "stars", label: "Điểm rèn luyện" },
  { href: "/settings", icon: "settings", label: "Cài đặt" },
];

export default function AdminSideNavBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Manual prefetch main routes
  useEffect(() => {
    adminNavItems.forEach(item => router.prefetch(item.href));
  }, [router]);

  return (
    <>
      {/* Desktop SideNavBar */}
      <aside className="hidden lg:flex w-72 flex-col gap-2 pt-4 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide pb-4">
        <div className="mb-4 px-4">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-brand)" }}>
            Bảng Điều Khiển Quản Trị
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {adminNavItems.map(({ href, icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                className="px-4 py-3 flex items-center justify-between font-semibold text-sm transition-all rounded-full"
                style={{
                  backgroundColor: isActive ? "var(--color-brand-bg)" : "transparent",
                  color: isActive ? "var(--color-brand)" : "var(--color-text-secondary)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div
          className="mt-8 p-4 rounded-2xl mx-2"
          style={{
            backgroundColor: "var(--color-accent-soft)",
            border: "1px solid var(--color-accent-border)",
          }}
        >
          <p
            className="text-[10px] font-bold mb-2 uppercase tracking-widest text-red-500"
          >
            Quyền Hạn Admin
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Hãy cẩn trọng khi thực hiện khóa hoặc xóa người dùng và bài đăng.
          </p>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full backdrop-blur-lg border-t flex justify-around items-center py-3 z-50 transition-colors duration-300"
        style={{
          backgroundColor: "var(--color-bg-nav-mobile)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <Link prefetch={true} className="flex flex-col items-center" href="/admin/admin-overview" style={{ color: "var(--color-brand)" }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Tổng quan</span>
        </Link>
        <Link prefetch={true} className="flex flex-col items-center" href="/admin/post-management" style={{ color: "var(--color-text-muted)" }}>
          <span className="material-symbols-outlined">article</span>
          <span className="text-[10px]">Bài đăng</span>
        </Link>
        <div
          className="relative -top-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-default"
          style={{
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-primary)",
            borderColor: "var(--color-border-subtle)",
            borderWidth: "1px",
          }}
        >
          <span className="material-symbols-outlined text-3xl text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
        </div>
        <Link prefetch={true} className="flex flex-col items-center relative" href="/admin/user-management" style={{ color: "var(--color-text-muted)" }}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px]">Người dùng</span>
        </Link>
        <Link prefetch={true} className="flex flex-col items-center" href="/admin/training-points" style={{ color: "var(--color-text-muted)" }}>
          <span className="material-symbols-outlined">stars</span>
          <span className="text-[10px]">Điểm RL</span>
        </Link>
      </nav>
    </>
  );
}
