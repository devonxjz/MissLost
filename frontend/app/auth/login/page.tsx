"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại, vui lòng kiểm tra lại!");
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      window.location.href = "/feeds";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fc] relative overflow-hidden">
      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Decorative blobs */}
        <div className="fixed -top-32 -left-32 w-96 h-96 bg-[#3647dc]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed -bottom-32 -right-32 w-[500px] h-[500px] bg-[#caceff]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#3647dc]/10 border border-white/60 p-10">

          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-[#5c6cff] hover:text-[#4b5aef] transition-colors">
              MissLost
            </Link>
            <p className="text-slate-500 text-sm mt-1">Đăng nhập để tiếp tục</p>
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-[#f8f9ff] text-sm font-semibold text-[#2c2f33] transition-all active:scale-[0.98] shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Đăng nhập với Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">hoặc</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
                  mail
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#f1f3f9] hover:bg-[#e8eaef] focus:bg-white border border-transparent focus:border-[#5c6cff]/40 rounded-2xl py-3 pl-11 pr-4 text-sm text-[#2c2f33] placeholder-[#9aa0a6] outline-none transition-all focus:ring-2 focus:ring-[#5c6cff]/15"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Mật khẩu
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-[#5c6cff] hover:underline font-medium">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
                  lock
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#f1f3f9] hover:bg-[#e8eaef] focus:bg-white border border-transparent focus:border-[#5c6cff]/40 rounded-2xl py-3 pl-11 pr-12 text-sm text-[#2c2f33] placeholder-[#9aa0a6] outline-none transition-all focus:ring-2 focus:ring-[#5c6cff]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <span className="material-symbols-outlined text-lg select-none">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="login-remember"
                className="w-4 h-4 rounded accent-[#3647dc] cursor-pointer"
              />
              <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                Ghi nhớ đăng nhập
              </span>
            </label>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-[#3647dc] hover:bg-[#2739d0] active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-[#3647dc]/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin select-none">progress_activity</span>
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-[#5c6cff] font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <span className="text-[#5c6cff] cursor-pointer hover:underline">Điều khoản dịch vụ</span>
          {" "}và{" "}
          <span className="text-[#5c6cff] cursor-pointer hover:underline">Chính sách bảo mật</span>.
        </p>
      </div>
    </div>
  );
}