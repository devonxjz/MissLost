"use client";

import { useEffect, useState } from "react";

/**
 * Đọc thông tin user từ localStorage và trả về role.
 * Trả về: "admin" | "user" | null (chưa đăng nhập) | undefined (đang tải)
 */
export default function useUserRole() {
  // Bắt đầu với undefined để phân biệt giữa "đang kiểm tra" và "chưa đăng nhập"
  const [role, setRole] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setRole(null);
        return;
      }
      const user = JSON.parse(raw);
      // Giả sử payload từ backend có dạng { role: "admin" }
      setRole(user?.role ?? "user");
    } catch {
      setRole(null);
    }
  }, []);

  return role;
}