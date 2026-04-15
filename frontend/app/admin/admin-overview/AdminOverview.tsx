"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

interface DashboardStats {
    total_users: number;
    active_lost_posts: number;
    active_found_posts: number;
    pending_review: number;
    total_handovers: number;
    items_in_storage: number;
}

interface EnhancedStats {
    posts: {
        lost: { total: number; by_status: Record<string, number> };
        found: { total: number; by_status: Record<string, number> };
        total: number;
    };
    users: {
        active: number;
        suspended: number;
        pending_verify: number;
        total: number;
    };
    recent_posts: {
        id: string;
        title: string;
        status: string;
        created_at: string;
        post_type: "lost" | "found";
        users: { full_name: string; avatar_url: string | null };
        item_categories: { name: string } | null;
    }[];
    top_categories: { name: string; count: number }[];
    recent_handovers: {
        id: string;
        status: string;
        handover_location: string;
        completed_at: string | null;
        created_at: string;
    }[];
}

interface UserRow {
    id: string;
    full_name: string;
    email: string;
    role: string;
    status: string;
    training_points: number;
    created_at: string;
}

export default function AdminOverview() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [enhanced, setEnhanced] = useState<EnhancedStats | null>(null);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [dashRaw, enhancedRaw, usersRaw] = await Promise.all([
                    apiFetch<any>("/admin/dashboard"),
                    apiFetch<any>("/admin/dashboard/enhanced"),
                    apiFetch<any>("/admin/users?page=1&limit=5"),
                ]);
                // Unwrap ResponseInterceptor wrapper { data: ... }
                setStats(dashRaw?.data ?? dashRaw);
                setEnhanced(enhancedRaw?.data ?? enhancedRaw);
                const usersPayload = usersRaw?.data ?? usersRaw;
                setUsers(Array.isArray(usersPayload) ? usersPayload : (usersPayload?.data ?? []));
            } catch (err) {
                console.error("Failed to load admin overview:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const totalPosts = (stats?.active_lost_posts ?? 0) + (stats?.active_found_posts ?? 0);
    const successRate = totalPosts > 0
        ? ((stats?.total_handovers ?? 0) / totalPosts * 100).toFixed(1)
        : "0.0";

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} phút trước`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} ngày trước`;
        return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    if (loading) {
        return (
            <main className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-on-surface-variant text-sm font-medium">Đang tải thống kê...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="p-8 space-y-8">
            {/* Header Section */}
            <section className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
                        System Overview
                    </h1>
                    <p className="text-on-surface-variant mt-1">
                        Thống kê real-time từ cơ sở dữ liệu Supabase.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-2 text-on-surface-variant font-semibold">
                        <span className="material-symbols-outlined text-lg">
                            update
                        </span>
                        Dữ liệu trực tiếp
                    </div>
                </div>
            </section>

            {/* Bento Grid Statistics — Real Data */}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Total Lost Posts */}
                <div className="glass-card p-6 rounded-lg shadow-sm flex flex-col justify-between h-40 group hover:shadow-indigo-500/10 transition-all border-none">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <span className="material-symbols-outlined">search_off</span>
                        </div>
                        <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-1 rounded-full">
                            ACTIVE
                        </span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant text-sm font-medium">
                            Bài Mất Đồ (Đã duyệt)
                        </p>
                        <p className="text-3xl font-black text-on-surface">
                            {stats?.active_lost_posts?.toLocaleString() ?? 0}
                        </p>
                    </div>
                </div>

                {/* Total Found Posts */}
                <div className="glass-card p-6 rounded-lg shadow-sm flex flex-col justify-between h-40 hover:shadow-indigo-500/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                check_circle
                            </span>
                        </div>
                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                            ACTIVE
                        </span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant text-sm font-medium">
                            Bài Nhặt Được (Đã duyệt)
                        </p>
                        <p className="text-3xl font-black text-on-surface">
                            {stats?.active_found_posts?.toLocaleString() ?? 0}
                        </p>
                    </div>
                </div>

                {/* Success Rate & Pending — Featured Card */}
                <div className="glass-card p-6 rounded-lg shadow-sm flex flex-col justify-between h-40 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-on-primary">
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="p-2 bg-[var(--color-bg-card-solid)]/20 rounded-lg backdrop-blur-md">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <p className="text-on-primary/80 font-medium">
                            Chờ duyệt: {stats?.pending_review ?? 0} bài
                        </p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-on-primary/80 text-sm font-medium">
                            Tỷ Lệ Trao Trả Thành Công
                        </p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-5xl font-black">{successRate}%</p>
                            <span className="text-on-primary/60 text-xs font-bold">
                                {stats?.total_handovers ?? 0} LƯỢT TRAO TRẢ
                            </span>
                        </div>
                    </div>
                    {/* Abstract Texture */}
                    <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                        <span className="material-symbols-outlined text-[180px]">
                            flare
                        </span>
                    </div>
                </div>
            </section>

            {/* Quick Stats Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="glass-card p-6 rounded-lg flex flex-col items-center justify-center text-center">
                    <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-2">
                        Tổng Người Dùng
                    </p>
                    <p className="text-5xl font-black text-primary">
                        {enhanced?.users?.total?.toLocaleString() ?? stats?.total_users?.toLocaleString() ?? 0}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {enhanced?.users?.active ?? 0} active
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {enhanced?.users?.suspended ?? 0} khóa
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            {enhanced?.users?.pending_verify ?? 0} chờ
                        </span>
                    </div>
                </div>

                {/* Items in Storage */}
                <div className="glass-card p-6 rounded-lg flex flex-col items-center justify-center text-center">
                    <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-2">
                        Đồ Trong Kho UEH
                    </p>
                    <p className="text-5xl font-black text-indigo-600">
                        {stats?.items_in_storage?.toLocaleString() ?? 0}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                        Đang lưu trữ
                    </div>
                </div>

                {/* Pending Review */}
                <div className="bg-indigo-600 rounded-lg p-6 text-white overflow-hidden relative group">
                    <div className="relative z-10">
                        <h4 className="font-bold text-lg">Bài Chờ Duyệt</h4>
                        <p className="text-white/80 text-sm mt-1">
                            Có {stats?.pending_review ?? 0} bài đăng đang chờ admin xem xét và phê duyệt.
                        </p>
                        <a
                            href="/admin/post-management"
                            className="mt-4 inline-block bg-[var(--color-bg-card-solid)]/20 hover:bg-[var(--color-bg-card-solid)]/30 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold transition-all"
                        >
                            Duyệt bài ngay →
                        </a>
                    </div>
                    <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl text-white/10 group-hover:scale-110 transition-transform">
                        rate_review
                    </span>
                </div>
            </section>

            {/* Posts Status Breakdown + Top Categories */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Breakdown */}
                <div className="glass-card rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-on-surface/5">
                        <h3 className="text-lg font-bold">Phân Bổ Trạng Thái Bài Đăng</h3>
                        <p className="text-on-surface-variant text-xs mt-1">
                            Tổng {enhanced?.posts?.total ?? 0} bài ({enhanced?.posts?.lost?.total ?? 0} mất đồ + {enhanced?.posts?.found?.total ?? 0} nhặt được)
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        {["pending", "approved", "rejected", "matched", "closed"].map((status) => {
                            const lostCount = enhanced?.posts?.lost?.by_status?.[status] ?? 0;
                            const foundCount = enhanced?.posts?.found?.by_status?.[status] ?? 0;
                            const total = lostCount + foundCount;
                            const maxVal = enhanced?.posts?.total ?? 1;
                            const pct = maxVal > 0 ? (total / maxVal) * 100 : 0;

                            const labels: Record<string, string> = {
                                pending: "Chờ duyệt",
                                approved: "Đã duyệt",
                                rejected: "Từ chối",
                                matched: "Đã ghép",
                                closed: "Đã đóng",
                            };
                            const colors: Record<string, string> = {
                                pending: "bg-amber-500",
                                approved: "bg-emerald-500",
                                rejected: "bg-red-500",
                                matched: "bg-indigo-500",
                                closed: "bg-slate-400",
                            };

                            return (
                                <div key={status}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="font-bold text-on-surface">{labels[status]}</span>
                                        <span className="font-bold text-on-surface-variant">
                                            {total} <span className="text-on-surface-variant/50">({lostCount}L + {foundCount}F)</span>
                                        </span>
                                    </div>
                                    <div className="w-full bg-surface-container-high rounded-full h-2">
                                        <div
                                            className={`${colors[status]} rounded-full h-2 transition-all duration-700`}
                                            style={{ width: `${Math.max(pct, 1)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="glass-card rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-on-surface/5">
                        <h3 className="text-lg font-bold">Danh Mục Phổ Biến</h3>
                        <p className="text-on-surface-variant text-xs mt-1">
                            Top danh mục được đăng nhiều nhất từ database.
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        {enhanced?.top_categories?.length ? (
                            enhanced.top_categories.map((cat, i) => {
                                const maxCount = enhanced.top_categories[0].count;
                                const pct = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
                                const colors = [
                                    "bg-indigo-500",
                                    "bg-emerald-500",
                                    "bg-amber-500",
                                    "bg-red-500",
                                    "bg-blue-500",
                                    "bg-purple-500",
                                ];
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-bold text-on-surface">
                                                {cat.name}
                                            </span>
                                            <span className="font-bold text-on-surface-variant">
                                                {cat.count} bài
                                            </span>
                                        </div>
                                        <div className="w-full bg-surface-container-high rounded-full h-2">
                                            <div
                                                className={`${colors[i % colors.length]} rounded-full h-2 transition-all duration-700`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-on-surface-variant text-sm py-8 text-center">
                                Chưa có dữ liệu danh mục.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Activity Feed */}
            {enhanced?.recent_posts && enhanced.recent_posts.length > 0 && (
                <section className="glass-card rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-on-surface/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold">Hoạt Động Gần Đây</h3>
                            <p className="text-on-surface-variant text-xs mt-1">
                                10 bài đăng mới nhất từ hệ thống.
                            </p>
                        </div>
                        <a
                            href="/admin/post-management"
                            className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                        >
                            Xem tất cả
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    <div className="divide-y divide-on-surface/5">
                        {enhanced.recent_posts.map((rp, i) => (
                            <div
                                key={`${rp.post_type}-${rp.id}`}
                                className="px-6 py-4 flex items-center gap-4 hover:bg-surface-container-low/50 transition-colors"
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        rp.post_type === "lost"
                                            ? "bg-red-50 text-red-500"
                                            : "bg-blue-50 text-blue-500"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {rp.post_type === "lost" ? "search_off" : "location_on"}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-on-surface truncate">
                                        {rp.title}
                                    </p>
                                    <p className="text-xs text-on-surface-variant">
                                        {rp.users?.full_name} • {rp.item_categories?.name ?? "Chưa phân loại"} •{" "}
                                        <span className="italic">{formatTimeAgo(rp.created_at)}</span>
                                    </p>
                                </div>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                        rp.status === "approved"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : rp.status === "pending"
                                            ? "bg-amber-50 text-amber-700"
                                            : rp.status === "rejected"
                                            ? "bg-red-50 text-red-700"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {rp.status === "approved"
                                        ? "Đã duyệt"
                                        : rp.status === "pending"
                                        ? "Chờ duyệt"
                                        : rp.status === "rejected"
                                        ? "Từ chối"
                                        : rp.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Users Table */}
            <section className="glass-card rounded-lg overflow-hidden shadow-sm">
                <div className="p-8 flex justify-between items-center border-b border-on-surface/5">
                    <div>
                        <h3 className="text-xl font-bold">Người Dùng Mới Nhất</h3>
                        <p className="text-on-surface-variant text-sm">
                            5 tài khoản đăng ký gần đây nhất từ database.
                        </p>
                    </div>
                    <a
                        href="/admin/user-management"
                        className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                    >
                        Xem tất cả
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low/50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                <th className="px-8 py-4">Người dùng</th>
                                <th className="px-8 py-4">Email</th>
                                <th className="px-8 py-4">Role</th>
                                <th className="px-8 py-4">Trạng thái</th>
                                <th className="px-8 py-4">Điểm RL</th>
                                <th className="px-8 py-4 text-right">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-on-surface/5">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant text-sm">
                                        Chưa có dữ liệu người dùng.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    className="w-10 h-10 rounded-full object-cover bg-surface-container-high"
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=e8eaef&color=5f6368&bold=true`}
                                                    alt={u.full_name}
                                                />
                                                <p className="font-bold text-on-surface text-sm">
                                                    {u.full_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-on-surface-variant">
                                            {u.email}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                u.role === "admin"
                                                    ? "bg-indigo-100 text-indigo-700"
                                                    : u.role === "storage_staff"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-[var(--color-bg-input)] text-slate-600"
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                u.status === "active"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : u.status === "suspended"
                                                    ? "bg-red-50 text-red-700"
                                                    : "bg-amber-50 text-amber-700"
                                            }`}>
                                                {u.status === "active" ? "Hoạt động" : u.status === "suspended" ? "Đã khóa" : "Chờ xác minh"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-on-surface">
                                            {u.training_points}
                                        </td>
                                        <td className="px-8 py-6 text-right text-sm text-on-surface-variant">
                                            {new Date(u.created_at).toLocaleDateString("vi-VN")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}