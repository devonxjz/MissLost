"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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
        router.replace("/auth/login");
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm shadow-blue-900/5 h-16 flex items-center">
            <div className="w-full max-w-[1600px] mx-auto px-6 flex items-center gap-6">

                {/* 1. Brand Logo */}
                <Link
                    href="/feeds"
                    className="text-2xl font-black tracking-tighter text-[#5c6cff] shrink-0 hover:text-[#4b5aef] transition-colors"
                >
                    MissLost
                </Link>

                {/* 2. Search Bar */}
                <div className="flex-1 max-w-[400px] hidden md:block">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] text-lg pointer-events-none">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm đồ vật..."
                            className="w-full bg-[#f1f3f9] hover:bg-[#e8eaef] focus:bg-white border-none rounded-full py-2.5 pl-10 pr-4 text-sm text-[#2c2f33] placeholder-[#9aa0a6] focus:ring-2 focus:ring-[#5c6cff]/20 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Spacer đẩy các phần tử còn lại sang phải */}
                <div className="flex-1" />

                {/* 3. Right Area — CTA + Bell + Profile Avatar */}
                <div className="flex items-center gap-4 shrink-0">

                    {/* CTA - Nút Đăng bài */}
                    <button className="bg-[#5c6cff] hover:bg-[#4b5aef] text-white px-6 py-2 rounded-full font-semibold text-sm active:scale-95 transition-all shadow-sm">
                        Đăng bài
                    </button>

                    {/* Icon Chuông */}
                    <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f9] transition-colors shrink-0">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>

                    {/* Profile Avatar */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 hover:ring-2 hover:ring-[#5c6cff]/50 transition-all flex items-center justify-center cursor-pointer"
                        >
                            <img
                                src="https://ui-avatars.com/api/?name=User&background=f1f3f9&color=5f6368"
                                alt="User avatar"
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl shadow-[#3647dc]/10 border border-slate-100 p-2 z-50">
                                <div className="px-3 py-2 border-b border-slate-50 mb-2">
                                    <p className="text-xs font-semibold text-slate-700">Tài khoản</p>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2.5 text-sm text-[#b41340] hover:bg-[#b41340]/5 rounded-xl font-bold transition-colors flex items-center gap-3"
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