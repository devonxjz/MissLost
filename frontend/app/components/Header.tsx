"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserInfo {
    full_name?: string;
    email?: string;
    avatar_url?: string;
}

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const stored = localStorage.getItem("user");
                if (stored) setUser(JSON.parse(stored));
            } catch { /* ignore */ }
        };

        // Initial load
        loadUserFromStorage();

        // Listen for custom event from settings page
        window.addEventListener("userUpdated", loadUserFromStorage);
        return () => window.removeEventListener("userUpdated", loadUserFromStorage);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
    };

    return (
        <header
            className="fixed top-0 w-full z-50 backdrop-blur-xl border-b h-16 flex items-center transition-colors duration-300"
            style={{
                backgroundColor: "var(--color-bg-elevated)",
                borderColor: "var(--color-border-subtle)",
                boxShadow: "var(--shadow-header)",
            }}
        >
            <div className="w-full max-w-[1600px] mx-auto px-6 flex items-center gap-6">

                {/* 1. Brand Logo */}
                <Link
                    href="/feeds"
                    className="text-2xl font-black tracking-tighter shrink-0 transition-colors"
                    style={{ color: "var(--color-brand)" }}
                >
                    MissLost
                </Link>

                {/* 2. Search Bar */}
                <div className="flex-1 max-w-[400px] hidden md:block">
                    <div className="relative group">
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm đồ vật..."
                            className="w-full border-none rounded-full py-2.5 pl-10 pr-4 text-sm transition-all outline-none focus:ring-2"
                            style={{
                                backgroundColor: "var(--color-bg-input)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                    </div>
                </div>

                {/* Spacer đẩy các phần tử còn lại sang phải */}
                <div className="flex-1" />

                {/* 3. Right Area — CTA + Bell + Profile Avatar */}
                <div className="flex items-center gap-4 shrink-0">

                    {/* Icon Chuông */}
                    <button
                        className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>

                    {/* Profile Avatar + User Info */}
                    <div className="relative flex items-center gap-3" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 transition-all flex items-center justify-center cursor-pointer"
                            style={{ border: "1px solid var(--color-border-subtle)" }}
                        >
                            <img
                                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || "User")}&background=f1f3f9&color=5f6368`}
                                alt="User avatar"
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {/* User name next to avatar */}
                        <div 
                            className="flex flex-col min-w-0 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span
                                className="text-sm font-bold truncate max-w-[120px] sm:max-w-[160px]"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                {user?.full_name || "Người dùng"}
                            </span>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="absolute right-0 top-full mt-3 w-56 rounded-2xl p-2 z-50 transition-colors duration-300"
                                style={{
                                    backgroundColor: "var(--color-bg-card-solid)",
                                    boxShadow: "var(--shadow-dropdown)",
                                    border: "1px solid var(--color-border-subtle)",
                                }}
                            >
                                <div className="px-3 py-2 mb-2" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                                    <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Tài khoản</p>
                                    <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--color-text-muted)" }}>{user?.email || ""}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2.5 text-sm rounded-xl font-bold flex items-center gap-3 cursor-pointer"
                                    style={{ color: "var(--color-danger)" }}
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </header>
    );
}