"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm({ ...form, [field]: e.type === "checkbox" ? e.target.checked : e.target.value });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          password: form.password,
          confirm_password: form.confirmPassword,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }
      
      const payload = data.data || data;

      // Auto-login or redirect to login after successful registration
      if (payload.access_token) {
        localStorage.setItem("access_token", payload.access_token);
        if (payload.user) {
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
        window.location.href = "/feeds";
      } else {
        // Redirect to login page if no token is returned (e.g., if email verification is required)
        window.location.href = "/auth/login?registered=true";
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fc] relative overflow-hidden">
      <div className="w-full max-w-md mx-4 relative z-10 pb-12 pt-6">
        {/* Decorative blobs */}
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] bg-[#3647dc]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-[500px] h-[500px] bg-[#caceff]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#3647dc]/10 border border-white/60 p-10">

        {/* Logo */}
        <div className="mb-2 text-center">
          <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-[#5c6cff] hover:text-[#4b5aef] transition-colors">
            MissLost
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-[#2c2f33]">Tạo tài khoản mới</h1>
          <p className="text-slate-500 text-sm mt-1">Tham gia cộng đồng tìm kiếm vật phẩm thất lạc</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? "bg-[#3647dc]" : "bg-slate-200"}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? "bg-[#3647dc]" : "bg-slate-200"}`} />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Thông tin cá nhân</p>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-fullname" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Họ và tên
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
                  person
                </span>
                <input
                  id="reg-fullname"
                  type="text"
                  value={form.fullName}
                  onChange={update("fullName")}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full bg-[#f1f3f9] hover:bg-[#e8eaef] focus:bg-white border border-transparent focus:border-[#5c6cff]/40 rounded-2xl py-3 pl-11 pr-4 text-sm text-[#2c2f33] placeholder-[#9aa0a6] outline-none transition-all focus:ring-2 focus:ring-[#5c6cff]/15"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
                  mail
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#f1f3f9] hover:bg-[#e8eaef] focus:bg-white border border-transparent focus:border-[#5c6cff]/40 rounded-2xl py-3 pl-11 pr-4 text-sm text-[#2c2f33] placeholder-[#9aa0a6] outline-none transition-all focus:ring-2 focus:ring-[#5c6cff]/15"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-phone" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Số điện thoại
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
                  phone
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="0912 345 678"
                  className="w-full bg-[#f1f3f9] hover:bg-[#e8eaef] focus:bg-white border border-transparent focus:border-[#5c6cff]/40 rounded-2xl py-3 pl-11 pr-4 text-sm text-[#2c2f33] placeholder-[#9aa0a6] outline-none transition-all focus:ring-2 focus:ring-[#5c6cff]/15"
                />
              </div>
            </div>

            <button
              id="reg-next"
              type="submit"
              className="mt-2 w-full bg-[#3647dc] hover:bg-[#2739d0] active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-[#3647dc]/25 flex items-center justify-center gap-2"
            >
              Tiếp theo
              <span className="material-symbols-outlined text-lg select-none">arrow_forward</span>
            </button>

            {/* Google */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">hoặc</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-[#f8f9ff] text-sm font-semibold text-[#2c2f33] transition-all active:scale-[0.98] shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Đăng ký với Google
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Thiết lập mật khẩu</p>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
                  lock
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  minLength={8}
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

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map((lvl) => {
                    const strength =
                      form.password.length < 6 ? 1 :
                      form.password.length < 8 ? 2 :
                      /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 4 : 3;
                    return (
                      <div
                        key={lvl}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          lvl <= strength
                            ? strength <= 1 ? "bg-red-400"
                              : strength <= 2 ? "bg-orange-400"
                              : strength <= 3 ? "bg-yellow-400"
                              : "bg-green-400"
                            : "bg-slate-200"
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-confirm" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
                  lock_reset
                </span>
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className={`w-full bg-[#f1f3f9] hover:bg-[#e8eaef] focus:bg-white border rounded-2xl py-3 pl-11 pr-12 text-sm text-[#2c2f33] placeholder-[#9aa0a6] outline-none transition-all focus:ring-2 ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? "border-red-400/50 focus:ring-red-300/30"
                      : "border-transparent focus:border-[#5c6cff]/40 focus:ring-[#5c6cff]/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <span className="material-symbols-outlined text-lg select-none">
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  Mật khẩu không khớp
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer group mt-1">
              <input
                id="reg-agree"
                type="checkbox"
                checked={form.agree}
                onChange={update("agree")}
                required
                className="mt-0.5 w-4 h-4 rounded accent-[#3647dc] cursor-pointer shrink-0"
              />
              <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">
                Tôi đồng ý với{" "}
                <span className="text-[#5c6cff] font-semibold cursor-pointer hover:underline">Điều khoản dịch vụ</span>
                {" "}và{" "}
                <span className="text-[#5c6cff] font-semibold cursor-pointer hover:underline">Chính sách bảo mật</span>{" "}
                của MissLost
              </span>
            </label>

            <div className="flex gap-3 mt-2">
              <button
                id="reg-back"
                type="button"
                onClick={() => setStep(1)}
                className="flex-none px-5 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-[#f1f3f9] text-sm font-semibold text-slate-600 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg select-none">arrow_back</span>
              </button>
              <button
                id="reg-submit"
                type="submit"
                disabled={isLoading || form.password !== form.confirmPassword}
                className="flex-1 bg-[#3647dc] hover:bg-[#2739d0] active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-[#3647dc]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin select-none">progress_activity</span>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "Tạo tài khoản"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Login link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-[#5c6cff] font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
