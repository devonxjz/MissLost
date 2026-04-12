"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // 1. Load user data into UI via Backend API
    const loadData = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const user = JSON.parse(rawUser);
          setUserId(user.id);
          setEmail(user.email || "");
          setFullName(user.full_name || "");
        }
        
        // Fetch fresh profile from backend
        const data = await apiFetch<any>('/users/me');
        if (data) {
          setFullName(data.full_name || "");
          setEmail(data.email || "");
          setBio(data.bio || "");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const updates: any = {};
      if (fullName) updates.full_name = fullName;
      if (email) updates.email = email;
      if (password) updates.password = password;
      if (bio !== undefined) updates.bio = bio;

      const res = await apiFetch<any>('/users/me', {
        method: "PATCH",
        body: JSON.stringify(updates)
      });

      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });

      // Sync local storage state if a new token & user are returned
      if (res?.access_token) {
        localStorage.setItem("access_token", res.access_token);
      }
      if (res?.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      } else {
        // Fallback sync
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const userObj = JSON.parse(rawUser);
          userObj.full_name = fullName;
          userObj.email = email;
          localStorage.setItem("user", JSON.stringify(userObj));
        }
      }
      
      setPassword(""); // clear password field after saving
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Đã xảy ra lỗi" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-10">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f33] mb-2">Cài đặt hệ thống</h1>
        <p className="text-[#595b61] leading-relaxed max-w-2xl">Quản lý tài khoản của bạn, cập nhật thông báo và điều chỉnh bảo mật để có trải nghiệm MissLost tốt nhất.</p>
      </header>

      {/* Bento Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <section className="lg:col-span-8 bg-white/75 backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#3647dc]/10 flex items-center justify-center text-[#3647dc]">
              <span className="material-symbols-outlined text-3xl">person</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Thông tin cá nhân</h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-semibold ${message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#595b61] ml-2">Họ và tên</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#eff0f7] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#3647dc]/20 focus:bg-white transition-all text-[#2c2f33] font-medium" type="text" placeholder="Nhập họ và tên..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#595b61] ml-2">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#eff0f7] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#3647dc]/20 focus:bg-white transition-all text-[#2c2f33] font-medium" type="email" placeholder="email@example.com" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-[#595b61] ml-2">Tiểu sử</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-[#eff0f7] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#3647dc]/20 focus:bg-white transition-all text-[#2c2f33] font-medium" rows={3} placeholder="Mô tả về bạn..." />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} disabled={isLoading} className="px-8 py-3 bg-[#3647dc] text-white rounded-full font-bold hover:shadow-xl hover:shadow-[#3647dc]/30 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </section>

        {/* Security / Password Card */}
        <section className="lg:col-span-4 bg-white/75 backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#b41340]/10 flex items-center justify-center text-[#b41340]">
              <span className="material-symbols-outlined text-3xl">security</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Bảo mật</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#595b61] ml-2">Đổi Mật khẩu mới</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#eff0f7] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#3647dc]/20 focus:bg-white transition-all text-[#2c2f33] font-medium" type="password" placeholder="Bỏ trống nếu không đổi" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
