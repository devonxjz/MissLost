"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";

interface PostRow {
    id: string;
    title: string;
    description: string;
    post_type: "lost" | "found";
    status: string;
    location: string;
    time_event: string;
    image_urls: string[];
    view_count: number;
    is_urgent?: boolean;
    is_in_storage?: boolean;
    created_at: string;
    users: { id: string; full_name: string; avatar_url: string | null };
    item_categories: { name: string; icon_name: string } | null;
}

interface PostsMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    approved: { label: "Đã duyệt", color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
    pending: { label: "Chờ duyệt", color: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-500 animate-pulse" },
    rejected: { label: "Từ chối", color: "text-red-700", bg: "bg-red-50", dot: "bg-red-500" },
    matched: { label: "Đã ghép", color: "text-indigo-700", bg: "bg-indigo-50", dot: "bg-indigo-500" },
    closed: { label: "Đã đóng", color: "text-slate-500", bg: "bg-slate-100", dot: "bg-slate-400" },
};

export default function PostManagement() {
    const [posts, setPosts] = useState<PostRow[]>([]);
    const [meta, setMeta] = useState<PostsMeta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Filters
    const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // Stats
    const [stats, setStats] = useState<any>(null);

    const loadPosts = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set("page", String(page));
                params.set("limit", "20");
                params.set("type", typeFilter);
                if (statusFilter) params.set("status", statusFilter);
                if (searchQuery) params.set("search", searchQuery);

                const res = await apiFetch<{ data: PostRow[]; meta: PostsMeta }>(
                    `/admin/posts?${params.toString()}`
                );
                setPosts(res.data);
                setMeta(res.meta);
            } catch (err) {
                console.error("Failed to load posts:", err);
            } finally {
                setLoading(false);
            }
        },
        [typeFilter, statusFilter, searchQuery]
    );

    const loadStats = useCallback(async () => {
        try {
            const raw = await apiFetch<any>("/admin/dashboard/enhanced");
            setStats(raw?.data ?? raw);
        } catch (err) {
            console.error("Stats error:", err);
        }
    }, []);

    useEffect(() => {
        loadPosts(1);
    }, [loadPosts]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const handleDelete = async (postId: string, postType: string) => {
        if (!confirm("Bạn có chắc muốn xóa bài đăng này?")) return;
        setActionLoading(postId);
        try {
            const endpoint = postType === "lost" ? `/lost-posts/${postId}` : `/found-posts/${postId}`;
            await apiFetch(endpoint, { method: "DELETE" });
            await loadPosts(meta.page);
            loadStats();
        } catch (err) {
            alert("Lỗi xóa bài: " + (err as Error).message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const totalPages = meta.totalPages;

    // Compute visible page numbers
    const getPageNumbers = () => {
        const pages: number[] = [];
        const start = Math.max(1, meta.page - 2);
        const end = Math.min(totalPages, meta.page + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    // Summary stats from enhanced endpoint
    const postStats = stats?.posts;
    const totalPosts = postStats?.total ?? 0;
    const lostCount = postStats?.lost?.total ?? 0;
    const foundCount = postStats?.found?.total ?? 0;
    const matchedCount = (postStats?.lost?.by_status?.matched ?? 0) + (postStats?.found?.by_status?.matched ?? 0)
        + (postStats?.lost?.by_status?.closed ?? 0) + (postStats?.found?.by_status?.closed ?? 0);

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

    return (
        <main className="min-h-screen">
            <section className="p-8 max-w-7xl mx-auto space-y-8 pt-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
                            Post Management
                        </h2>
                        <p className="text-on-surface-variant mt-2 max-w-xl text-lg">
                            Quản lý tất cả bài đăng mất đồ & nhặt được. Dữ liệu trực tiếp từ Supabase.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-surface-container-low px-4 py-2.5 rounded-full flex items-center gap-2 text-on-surface-variant font-semibold text-sm">
                            <span className="material-symbols-outlined text-lg">article</span>
                            Tổng: {totalPosts} bài đăng
                        </div>
                    </div>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
                                Tổng bài
                            </p>
                            <span className="material-symbols-outlined text-primary text-xl">article</span>
                        </div>
                        <h3 className="text-3xl font-black text-on-surface tracking-tighter">
                            {totalPosts.toLocaleString()}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                            {postStats?.lost?.total ?? 0} mất đồ • {postStats?.found?.total ?? 0} nhặt được
                        </p>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest font-black text-red-600">
                                Mất đồ
                            </p>
                            <span className="material-symbols-outlined text-red-500 text-xl">search_off</span>
                        </div>
                        <h3 className="text-3xl font-black text-red-600 tracking-tighter">
                            {lostCount}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Bài đăng tìm đồ
                        </p>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest font-black text-blue-600">
                                Nhặt được
                            </p>
                            <span className="material-symbols-outlined text-blue-500 text-xl">location_on</span>
                        </div>
                        <h3 className="text-3xl font-black text-blue-600 tracking-tighter">
                            {foundCount}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Bài đăng nhặt đồ
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-primary-container p-5 rounded-2xl shadow-xl shadow-primary/20 overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-on-primary/70 text-[10px] font-bold uppercase tracking-widest mb-3">
                                Đã ghép / đóng
                            </p>
                            <h3 className="text-3xl font-black text-on-primary tracking-tighter">
                                {matchedCount}
                            </h3>
                            <p className="text-on-primary/60 text-xs mt-1">
                                Đã tìm thấy chủ nhân
                            </p>
                        </div>
                        <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-on-primary/10">
                            handshake
                        </span>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Type Filter */}
                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <label className="text-[10px] uppercase tracking-widest font-black text-primary mb-2 block">
                            Loại bài đăng
                        </label>
                        <div className="flex gap-2">
                            {(["all", "lost", "found"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTypeFilter(t)}
                                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                                        typeFilter === t
                                            ? "bg-[var(--color-accent)] text-white shadow-md"
                                            : "admin-btn-inactive"
                                    }`}
                                >
                                    {t === "all" ? "Tất cả" : t === "lost" ? "Mất đồ" : "Nhặt được"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <label className="text-[10px] uppercase tracking-widest font-black text-primary mb-2 block">
                            Trạng thái
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full admin-input rounded-xl text-xs font-bold py-2 px-3"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ duyệt</option>
                            <option value="approved">Đã duyệt</option>
                            <option value="rejected">Từ chối</option>
                            <option value="matched">Đã ghép</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <label className="text-[10px] uppercase tracking-widest font-black text-primary mb-2 block">
                            Tìm kiếm
                        </label>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nhập tiêu đề..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="flex-1 admin-input rounded-xl text-xs font-medium py-2 px-3"
                            />
                            <button
                                type="submit"
                                className="px-3 py-2 rounded-xl bg-[var(--color-accent)] text-white text-xs font-bold"
                            >
                                <span className="material-symbols-outlined text-sm">search</span>
                            </button>
                        </form>
                    </div>

                    {/* Matched Quick Filter */}
                    <div className="bg-gradient-to-br from-primary to-primary-container p-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between group cursor-pointer overflow-hidden relative"
                         onClick={() => { setStatusFilter("matched"); }}
                    >
                        <div className="relative z-10">
                            <p className="text-on-primary/70 text-[10px] font-bold uppercase tracking-widest">
                                Đã ghép
                            </p>
                            <p className="text-on-primary text-2xl font-black">{matchedCount} bài</p>
                        </div>
                        <span
                            className="material-symbols-outlined text-on-primary/20 text-6xl absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform duration-500"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            handshake
                        </span>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="glass-card rounded-3xl border border-white/30 shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-on-surface-variant text-sm font-medium">Đang tải bài đăng...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                            Bài đăng
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                            Loại
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                            Người đăng
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                            Ngày đăng
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                            Lượt xem
                                        </th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {posts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-16 text-center text-on-surface-variant">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                                                        inbox
                                                    </span>
                                                    <p className="text-sm font-medium">Không có bài đăng nào.</p>
                                                    <p className="text-xs">Thử thay đổi bộ lọc để xem kết quả khác.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        posts.map((p) => {
                                            const statusInfo = STATUS_MAP[p.status] ?? STATUS_MAP.approved;
                                            return (
                                                <tr
                                                    key={`${p.post_type}-${p.id}`}
                                                    className="hover:bg-primary/[0.02] transition-colors group"
                                                >
                                                    {/* Post Info */}
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0">
                                                                {p.image_urls?.[0] ? (
                                                                    <img
                                                                        className="w-full h-full object-cover"
                                                                        src={p.image_urls[0]}
                                                                        alt={p.title}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <span className="material-symbols-outlined text-on-surface-variant/30">
                                                                            {p.post_type === "lost"
                                                                                ? "search_off"
                                                                                : "location_on"}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">
                                                                    {p.title}
                                                                </p>
                                                                <p className="text-[11px] text-on-surface-variant font-medium truncate max-w-[200px]">
                                                                    {p.item_categories?.name ?? "Chưa phân loại"} •{" "}
                                                                    {p.location ?? "—"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Type */}
                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                                p.post_type === "lost"
                                                                    ? "bg-red-50 text-red-600"
                                                                    : "bg-blue-50 text-blue-600"
                                                            }`}
                                                        >
                                                            <span className="material-symbols-outlined text-xs mr-1">
                                                                {p.post_type === "lost" ? "search_off" : "location_on"}
                                                            </span>
                                                            {p.post_type === "lost" ? "Mất đồ" : "Nhặt được"}
                                                        </span>
                                                    </td>

                                                    {/* Reporter */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                className="w-7 h-7 rounded-full bg-surface-container-high object-cover"
                                                                src={
                                                                    p.users?.avatar_url ??
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(p.users?.full_name ?? "U")}&background=e8eaef&color=5f6368&bold=true&size=28`
                                                                }
                                                                alt={p.users?.full_name}
                                                            />
                                                            <span className="text-sm font-medium text-on-surface-variant truncate max-w-[120px]">
                                                                {p.users?.full_name ?? "—"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Date */}
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm text-on-surface-variant">
                                                            {new Date(p.created_at).toLocaleDateString("vi-VN")}
                                                        </p>
                                                        <p className="text-[10px] text-outline italic">
                                                            {formatTimeAgo(p.created_at)}
                                                        </p>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                                                            <span
                                                                className={`text-xs font-bold ${statusInfo.color}`}
                                                            >
                                                                {statusInfo.label}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Views */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-1 text-on-surface-variant">
                                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                                            <span className="text-xs font-bold">{p.view_count ?? 0}</span>
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleDelete(p.id, p.post_type)}
                                                                disabled={actionLoading === p.id}
                                                                className="px-2.5 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">
                                                                    delete
                                                                </span>
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-8 py-6 bg-surface-container-high/30 flex items-center justify-between">
                            <p className="text-xs font-bold text-on-surface-variant">
                                Trang {meta.page} / {totalPages} — Tổng {meta.total.toLocaleString()} bài đăng
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => loadPosts(meta.page - 1)}
                                    disabled={meta.page <= 1}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                {getPageNumbers().map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => loadPosts(p)}
                                        className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                            meta.page === p
                                                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                                                : "bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => loadPosts(meta.page + 1)}
                                    disabled={meta.page >= totalPages}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Stats — Category Distribution & Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Top Categories */}
                    <div className="glass-card p-6 rounded-3xl border border-white/30 shadow-lg relative overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                            Phân loại phổ biến
                        </p>
                        {stats?.top_categories?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.top_categories.map((cat: any, i: number) => {
                                    const maxCount = stats.top_categories[0].count;
                                    const pct = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-on-surface">{cat.name}</span>
                                                <span className="font-bold text-on-surface-variant">
                                                    {cat.count}
                                                </span>
                                            </div>
                                            <div className="w-full bg-surface-container-high rounded-full h-1.5">
                                                <div
                                                    className="bg-primary rounded-full h-1.5 transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-on-surface-variant">Chưa có dữ liệu phân loại.</p>
                        )}
                    </div>

                    {/* Status Breakdown */}
                    <div className="glass-card p-6 rounded-3xl border border-white/30 shadow-lg relative overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                            Phân bổ trạng thái
                        </p>
                        {postStats ? (
                            <div className="space-y-3">
                                {Object.entries(STATUS_MAP).map(([key, info]) => {
                                    const count =
                                        (postStats.lost?.by_status?.[key] ?? 0) +
                                        (postStats.found?.by_status?.[key] ?? 0);
                                    const pct = totalPosts > 0 ? (count / totalPosts) * 100 : 0;
                                    return (
                                        <div key={key}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={`font-bold ${info.color}`}>{info.label}</span>
                                                <span className="font-bold text-on-surface-variant">{count}</span>
                                            </div>
                                            <div className="w-full bg-surface-container-high rounded-full h-1.5">
                                                <div
                                                    className={`${info.dot.replace("animate-pulse", "")} rounded-full h-1.5 transition-all duration-500`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-on-surface-variant">Đang tải...</p>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-6 rounded-3xl border border-white/30 shadow-lg relative overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                            Hoạt động gần đây
                        </p>
                        {stats?.recent_posts?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recent_posts.slice(0, 5).map((rp: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div
                                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                                rp.post_type === "lost" ? "bg-red-400" : "bg-blue-400"
                                            }`}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-on-surface truncate">
                                                {rp.title}
                                            </p>
                                            <p className="text-[10px] text-on-surface-variant">
                                                {rp.users?.full_name} • {formatTimeAgo(rp.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-on-surface-variant">Chưa có hoạt động.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}