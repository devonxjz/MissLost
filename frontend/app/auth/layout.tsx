import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MissLost - Đăng nhập & Đăng ký",
  description: "Đăng nhập hoặc tạo tài khoản MissLost để tham gia cộng đồng tìm kiếm vật phẩm thất lạc.",
};

// ClientShell trong root layout tự ẩn Header/SideNavBar cho route /auth/*
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]">
      {children}
    </div>
  );
}
