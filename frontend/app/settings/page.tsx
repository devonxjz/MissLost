"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import { useTheme } from "@/app/components/ThemeProvider";

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [language, setLanguage] = useState("vi");
  const { theme, setTheme } = useTheme();

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
        <h1
          className="text-4xl font-extrabold tracking-tight mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Cài đặt hệ thống
        </h1>
        <p
          className="leading-relaxed max-w-2xl"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Quản lý tài khoản của bạn, cập nhật thông báo và điều chỉnh bảo mật để có trải nghiệm MissLost tốt nhất.
        </p>
      </header>

      {/* Bento Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <section
          className="lg:col-span-8 backdrop-blur-xl p-8 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: "var(--color-bg-card)",
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" }}
            >
              <span className="material-symbols-outlined text-3xl">person</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Thông tin cá nhân
            </h2>
          </div>

          {message && (
            <div
              className="mb-6 p-4 rounded-xl text-sm font-semibold"
              style={{
                backgroundColor: message.type === "success" ? "var(--color-success-soft)" : "var(--color-danger-soft)",
                color: message.type === "success" ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-2" style={{ color: "var(--color-text-secondary)" }}>Họ và tên</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-none rounded-2xl py-4 px-5 focus:ring-2 transition-all font-medium"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  color: "var(--color-text-primary)",
                }}
                type="text"
                placeholder="Nhập họ và tên..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-2" style={{ color: "var(--color-text-secondary)" }}>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-none rounded-2xl py-4 px-5 focus:ring-2 transition-all font-medium"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  color: "var(--color-text-primary)",
                }}
                type="email"
                placeholder="email@example.com"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold ml-2" style={{ color: "var(--color-text-secondary)" }}>Tiểu sử</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border-none rounded-2xl py-4 px-5 focus:ring-2 transition-all font-medium"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  color: "var(--color-text-primary)",
                }}
                rows={3}
                placeholder="Mô tả về bạn..."
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-8 py-3 text-white rounded-full font-bold transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--color-accent)",
                boxShadow: "var(--shadow-button)",
              }}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </section>

        {/* Security / Password Card */}
        <section
          className="lg:col-span-4 backdrop-blur-xl p-8 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: "var(--color-bg-card)",
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--color-danger-soft)", color: "var(--color-danger)" }}
            >
              <span className="material-symbols-outlined text-3xl">security</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Bảo mật
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-2" style={{ color: "var(--color-text-secondary)" }}>Đổi Mật khẩu mới</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-none rounded-2xl py-4 px-5 focus:ring-2 transition-all font-medium"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  color: "var(--color-text-primary)",
                }}
                type="password"
                placeholder="Bỏ trống nếu không đổi"
              />
            </div>
          </div>
        </section>

        {/* ═══ Theme Mode Selector ═══ */}
        <section
          className="col-span-1 lg:col-span-6 backdrop-blur-xl p-8 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: "var(--color-bg-card)",
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: theme === "dark" ? "rgba(108,123,255,0.12)" : "rgba(91,108,255,0.1)",
                color: "var(--color-brand)",
              }}
            >
              <span className="material-symbols-outlined text-3xl">
                {theme === "dark" ? "dark_mode" : "light_mode"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                Giao diện
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                Chọn chế độ hiển thị yêu thích
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Light Mode Option */}
            <button
              onClick={() => setTheme("light")}
              className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: theme === "light" ? "var(--color-brand-bg)" : "var(--color-bg-input)",
                border: theme === "light"
                  ? "2px solid var(--color-brand)"
                  : "2px solid transparent",
              }}
            >
              {/* Preview mockup */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border relative" style={{ borderColor: "var(--color-border-subtle)" }}>
                <div className="absolute inset-0 bg-[#f5f6fc]">
                  {/* Mini header */}
                  <div className="h-3 bg-white border-b border-slate-100 flex items-center px-1.5">
                    <div className="w-4 h-1 bg-[#5c6cff] rounded-full" />
                  </div>
                  {/* Mini sidebar + content */}
                  <div className="flex h-full pt-0.5">
                    <div className="w-1/4 px-1 pt-1 space-y-0.5">
                      <div className="h-1 bg-slate-200 rounded-full" />
                      <div className="h-1 bg-[#5c6cff]/20 rounded-full" />
                      <div className="h-1 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex-1 p-1 space-y-1">
                      <div className="h-2 bg-white rounded border border-slate-100" />
                      <div className="h-2 bg-white rounded border border-slate-100" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{
                    color: theme === "light" ? "var(--color-brand)" : "var(--color-text-muted)",
                    fontVariationSettings: theme === "light" ? "'FILL' 1" : undefined,
                  }}
                >
                  light_mode
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: theme === "light" ? "var(--color-brand)" : "var(--color-text-secondary)" }}
                >
                  Sáng
                </span>
              </div>

              {/* Check badge */}
              {theme === "light" && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
              )}
            </button>

            {/* Dark Mode Option */}
            <button
              onClick={() => setTheme("dark")}
              className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: theme === "dark" ? "var(--color-brand-bg)" : "var(--color-bg-input)",
                border: theme === "dark"
                  ? "2px solid var(--color-brand)"
                  : "2px solid transparent",
              }}
            >
              {/* Preview mockup */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border relative" style={{ borderColor: "var(--color-border-subtle)" }}>
                <div className="absolute inset-0 bg-[#0f1117]">
                  {/* Mini header */}
                  <div className="h-3 bg-[#1e2030] border-b border-white/5 flex items-center px-1.5">
                    <div className="w-4 h-1 bg-[#8490ff] rounded-full" />
                  </div>
                  {/* Mini sidebar + content */}
                  <div className="flex h-full pt-0.5">
                    <div className="w-1/4 px-1 pt-1 space-y-0.5">
                      <div className="h-1 bg-white/10 rounded-full" />
                      <div className="h-1 bg-[#8490ff]/20 rounded-full" />
                      <div className="h-1 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex-1 p-1 space-y-1">
                      <div className="h-2 bg-[#1a1c28] rounded border border-white/5" />
                      <div className="h-2 bg-[#1a1c28] rounded border border-white/5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{
                    color: theme === "dark" ? "var(--color-brand)" : "var(--color-text-muted)",
                    fontVariationSettings: theme === "dark" ? "'FILL' 1" : undefined,
                  }}
                >
                  dark_mode
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: theme === "dark" ? "var(--color-brand)" : "var(--color-text-secondary)" }}
                >
                  Tối
                </span>
              </div>

              {/* Check badge */}
              {theme === "dark" && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
              )}
            </button>
          </div>
        </section>

        {/* Preferences / Language Card */}
        <section
          className="col-span-1 lg:col-span-6 backdrop-blur-xl p-8 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: "var(--color-bg-card)",
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--color-success-soft)", color: "var(--color-success)" }}
            >
              <span className="material-symbols-outlined text-3xl">language</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              Tùy chọn hiển thị
            </h2>
          </div>
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-2" style={{ color: "var(--color-text-secondary)" }}>Ngôn ngữ mặc định</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="w-full border-none rounded-2xl py-4 px-5 focus:ring-2 transition-all font-medium appearance-none cursor-pointer"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  color: "var(--color-text-primary)",
                }}
              >
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en">🇺🇸 Tiếng Anh (English)</option>
                <option value="zh">🇨🇳 Tiếng Trung (中文)</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
