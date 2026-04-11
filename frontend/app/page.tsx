"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      router.replace("/feeds");
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fc]">
      <div className="w-8 h-8 border-4 border-[#3647dc] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
