"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

interface UserInfo {
    full_name?: string;
    email?: string;
    avatar_url?: string;
}

export default function Header() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const mockNotifications = [
        { id: 1, title: "Yêu cầu liên hệ", content: "Nguyễn Văn A muốn liên hệ với bạn về bài đăng.", time: "5 phút trước", unread: true, icon: "contact_mail", color: "text-blue-500", bg: "bg-blue-50" },
        { id: 2, title: "Tin nhắn mới", content: "Bạn có 1 tin nhắn mới từ Trần Thị B.", time: "10 phút trước", unread: true, icon: "chat", color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: 3, title: "Điểm rèn luyện", content: "Bạn được cộng +5 điểm rèn luyện cho việc trao trả đồ.", time: "1 giờ trước", unread: false, icon: "military_tech", color: "text-amber-500", bg: "bg-amber-50" },
        { id: 4, title: "Yêu cầu trao trả", content: "Lê Văn C đã gửi yêu cầu trao trả cho đồ bạn nhặt.", time: "2 giờ trước", unread: false, icon: "handshake", color: "text-indigo-500", bg: "bg-indigo-50" }
    ];

    const unreadCount = mockNotifications.filter(n => n.unread).length;

    const loadUserFromStorage = useCallback(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    const syncUserData = useCallback(async () => {
        try {
            const response = await apiFetch<any>("/users/me");
            // Backend ResponseInterceptor wraps in { data: ... }
            const freshUser = response?.data ?? response;
            if (freshUser && freshUser.id) {
                // Merge với localStorage để giữ lại các field cũ (vd: role từ login)
                const stored = localStorage.getItem("user");
                const localUser = stored ? JSON.parse(stored) : {};
                const merged = { ...localUser, ...freshUser };
                localStorage.setItem("user", JSON.stringify(merged));
                setUser(merged);
            }
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        // 1. Chạy lần đầu từ cache (giữ data lúc F5)
        loadUserFromStorage();

        // 2. Chạy ngầm sync data mới nhất (Step 4)
        syncUserData();

        // 3. Lắng nghe sự kiện (Step 3)
        window.addEventListener("userUpdated", loadUserFromStorage);
        return () => window.removeEventListener("userUpdated", loadUserFromStorage);
    }, [loadUserFromStorage, syncUserData]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            // Call backend logout to clear cookie
            await fetch("http://localhost:3001/auth/logout", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear localStorage
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/auth/login";
        }
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
                    <div className="relative flex items-center justify-center cursor-pointer" ref={notificationsRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer hover:bg-black/5"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            <span className="material-symbols-outlined text-xl">notifications</span>
                            {/* Chấm tròn đỏ hiển thị khi có thông báo chưa đọc */}
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 pointer-events-none" style={{ borderColor: 'var(--color-bg-elevated)' }}></span>
                            )}
                        </button>

                        {/* Notifications Dropdown Menu */}
                        {isNotificationsOpen && (
                            <div
                                className="absolute right-0 top-full mt-3 w-80 rounded-2xl p-2 z-50 transition-colors duration-300"
                                style={{
                                    backgroundColor: "var(--color-bg-card-solid)",
                                    boxShadow: "var(--shadow-dropdown)",
                                    border: "1px solid var(--color-border-subtle)",
                                }}
                            >
                                <div className="px-3 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                                    <h3 className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>Thông báo</h3>
                                    {unreadCount > 0 && (
                                        <span className="bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {unreadCount} mới
                                        </span>
                                    )}
                                </div>
                                
                                <div className="max-h-80 overflow-y-auto py-1">
                                    {mockNotifications.length > 0 ? (
                                        mockNotifications.map(nav => (
                                            <div 
                                                key={nav.id}
                                                className={`px-3 py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer flex gap-3 ${nav.unread ? "bg-blue-500/10 dark:bg-blue-500/20" : ""}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${nav.bg} ${nav.color}`}>
                                                    <span className="material-symbols-outlined text-lg">{nav.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <p className={`text-sm truncate pr-2 ${nav.unread ? 'font-bold' : 'font-medium'}`} style={{ color: "var(--color-text-primary)" }}>
                                                            {nav.title}
                                                        </p>
                                                        {nav.unread && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>}
                                                    </div>
                                                    <p className="text-xs line-clamp-2" style={{ color: "var(--color-text-muted)" }}>
                                                        {nav.content}
                                                    </p>
                                                    <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                                                        {nav.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-sm py-4" style={{ color: "var(--color-text-muted)" }}>Không có thông báo mới.</p>
                                    )}
                                </div>
                                <div className="px-3 pt-2 mt-1" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
                                    <button
                                        className="w-full py-2 text-xs font-bold text-center rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        style={{ color: "var(--color-brand)" }}
                                    >
                                        Xem tất cả
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

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