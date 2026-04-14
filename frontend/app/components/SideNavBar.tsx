"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

const navItems = [
  { href: "/feeds", icon: "home", label: "Trang chủ" },
  { href: "/lost", icon: "search_off", label: "Mất đồ" },
  { href: "/found", icon: "location_on", label: "Nhặt được" },
  { href: "/storage", icon: "inventory_2", label: "Kho lưu trữ" },
  { href: "/messages", icon: "chat_bubble", label: "Tin nhắn" },
  { href: "/trust-score", icon: "verified_user", label: "Điểm rèn luyện" },
  { href: "/my-posts", icon: "post_add", label: "Bài đăng của tôi" },
  { href: "/settings", icon: "settings", label: "Cài đặt" },
];

export default function SideNavBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Manual prefetch main routes
  useEffect(() => {
    const priorityRoutes = ["/feeds", "/lost", "/found", "/messages", "/settings"];
    priorityRoutes.forEach(route => router.prefetch(route));
  }, [router]);

  const [unreadCount, setUnreadCount] = useState(0);

  // Poll unread count every 15s
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return; // Only fetch if logged in
        const res = await apiFetch<any>('/chat/unread-count');
        if (res && typeof res.data === 'number') {
          setUnreadCount(res.data);
        }
      } catch (e) {
        // Ignore unread fetch errors
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Desktop SideNavBar */}
      <aside className="hidden lg:flex w-72 flex-col gap-2 pt-4 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide pb-4">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, icon, label }) => {
            const isActive = pathname === href;
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
                {/* Unread Message Badge */}
                {href === "/messages" && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
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
            className="text-[10px] font-bold mb-2 uppercase tracking-widest"
            style={{ color: "var(--color-accent)" }}
          >
            Mẹo cộng đồng
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Hãy luôn kiểm tra Trust Score của người liên hệ nhé!
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
        <Link prefetch={true} className="flex flex-col items-center" href="/feeds" style={{ color: "var(--color-brand)" }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] font-bold">Trang chủ</span>
        </Link>
        <Link prefetch={true} className="flex flex-col items-center" href="/lost" style={{ color: "var(--color-text-muted)" }}>
          <span className="material-symbols-outlined">search_off</span>
          <span className="text-[10px]">Mất đồ</span>
        </Link>
        <div
          className="relative -top-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-text-on-accent)",
            borderColor: "var(--color-bg-primary)",
            borderWidth: "4px",
          }}
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </div>
        <Link prefetch={true} className="flex flex-col items-center relative" href="/messages" style={{ color: "var(--color-text-muted)" }}>
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px]">Chat</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-white"></span>
          )}
        </Link>
        <Link prefetch={true} className="flex flex-col items-center" href="/settings" style={{ color: "var(--color-text-muted)" }}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Cá nhân</span>
        </Link>
      </nav>
    </>
  );
}