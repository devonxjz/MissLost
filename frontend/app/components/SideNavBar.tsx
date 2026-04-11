"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "home", label: "Trang chủ" },
  { href: "/lost", icon: "search_off", label: "Mất đồ" },
  { href: "/found", icon: "location_on", label: "Nhặt được" },
  { href: "/storage", icon: "inventory_2", label: "Kho lưu trữ" },
  { href: "/messages", icon: "chat_bubble", label: "Tin nhắn" },
  { href: "/trust-score", icon: "verified_user", label: "Điểm uy tín" },
  { href: "/my-posts", icon: "post_add", label: "Bài đăng của tôi" },
  { href: "/settings", icon: "settings", label: "Cài đặt" },
];

export default function SideNavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop SideNavBar */}
      <aside className="hidden lg:flex w-72 flex-col gap-2 pt-4 shrink-0">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              alt="User profile"
              className="w-10 h-10 rounded-full border-2 border-[#3647dc]/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuzoumdYUvT-aTdjXGews9g11qRL6mhoT6azDHBlYJ7rS0CLFSyAXNhVA7R23H4NtVqb_EASEOXnPX9OntCm-CIq8nf26-0O88XlA-b5bT0v42XKwW7rfaNnkENXfGvSNiQDJkX6mSIpTFZV1kum2E8frP6k2MO62SaJO_a2arOa5X0cHnGn-FMTJIamF7fz0a-y3AzxgA1KIB6CwqWxiG1kuSwQWzq9tr4T6P615SjKbJFcMjwK6Y6XgcUWBtyeZ_jUbyxhobakU"
            />
            <div>
              <p className="font-bold text-sm text-[#5B6CFF]">MissLost Profile</p>
              <p className="text-xs text-slate-500">Verified Member</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 flex items-center gap-3 font-semibold text-sm transition-all rounded-full
                  ${isActive
                    ? "bg-[#5B6CFF]/15 text-[#5B6CFF]"
                    : "text-slate-600 hover:translate-x-1 hover:text-[#5B6CFF]"
                  }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-[#3647dc]/5 rounded-2xl border border-[#3647dc]/10 mx-2">
          <p className="text-[10px] font-bold text-[#3647dc] mb-2 uppercase tracking-widest">Mẹo cộng đồng</p>
          <p className="text-xs text-[#595b61] leading-relaxed">Hãy luôn kiểm tra Trust Score của người liên hệ nhé!</p>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center py-3 z-50">
        <Link className="text-[#3647dc] flex flex-col items-center" href="/">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] font-bold">Trang chủ</span>
        </Link>
        <Link className="text-slate-400 flex flex-col items-center" href="/lost">
          <span className="material-symbols-outlined">search_off</span>
          <span className="text-[10px]">Mất đồ</span>
        </Link>
        <div className="relative -top-6 bg-[#3647dc] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-[#3647dc]/30 border-4 border-[#f5f6fc] cursor-pointer">
          <span className="material-symbols-outlined text-3xl">add</span>
        </div>
        <Link className="text-slate-400 flex flex-col items-center" href="/messages">
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px]">Chat</span>
        </Link>
        <Link className="text-slate-400 flex flex-col items-center" href="/settings">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Cá nhân</span>
        </Link>
      </nav>
    </>
  );
}
