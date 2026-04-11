import Link from "next/link";

const navItems = [
  { label: "Bảng tin", icon: "dynamic_feed", href: "/" },
  { label: "Mất đồ", icon: "search_off", href: "/lost" },
  { label: "Nhặt được", icon: "location_on", href: "/found" },
  { label: "Kho", icon: "inventory_2", href: "/storage" },
  { label: "Tin nhắn", icon: "chat_bubble", href: "/messages" },
  { label: "Cá nhân", icon: "account_circle", href: "/settings" },
];

export default function GlassDock() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="glass-dock px-6 py-3 rounded-3xl flex items-center gap-2 shadow-2xl shadow-background/50">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-colors">
              {item.icon}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/70 group-hover:text-on-surface transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
