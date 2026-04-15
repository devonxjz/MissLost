"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";

interface UserPoints {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    role: string;
    status: string;
    training_points: number;
    created_at: string;
}

interface PointLog {
    id: string;
    user_id: string;
    points_delta: number;
    reason: string;
    balance_after: number;
    created_at: string;
    users: { full_name: string; email: string; avatar_url: string | null } | null;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function TrainingPoints() {
    const [tab, setTab] = useState<"users" | "logs">("users");

    // Users tab
    const [users, setUsers] = useState<UserPoints[]>([]);
    const [usersMeta, setUsersMeta] = useState<Meta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [usersLoading, setUsersLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    // Logs tab
    const [logs, setLogs] = useState<PointLog[]>([]);
    const [logsMeta, setLogsMeta] = useState<Meta>({ page: 1, limit: 30, total: 0, totalPages: 0 });
    const [logsLoading, setLogsLoading] = useState(true);

    // Adjust modal
    const [adjustUser, setAdjustUser] = useState<UserPoints | null>(null);
    const [adjustPoints, setAdjustPoints] = useState("");
    const [adjustReason, setAdjustReason] = useState("");
    const [adjustLoading, setAdjustLoading] = useState(false);

    const loadUsers = useCallback(
        async (page = 1) => {
            setUsersLoading(true);
            try {
                const params = new URLSearchParams();
                params.set("page", String(page));
                params.set("limit", "20");
                params.set("sort", sortDir);
                if (searchQuery) params.set("search", searchQuery);
                const raw = await apiFetch<any>(`/admin/training-points?${params}`);
                const res = raw?.data ? raw : { data: raw, meta: { page, limit: 20, total: 0, totalPages: 0 } };
                setUsers(Array.isArray(res.data) ? res.data : []);
                setUsersMeta(res.meta);
            } catch (err) {
                console.error("Failed to load training points:", err);
            } finally {
                setUsersLoading(false);
            }
        },
        [searchQuery, sortDir]
    );

    const loadLogs = useCallback(async (page = 1) => {
        setLogsLoading(true);
        try {
            const raw = await apiFetch<any>(`/admin/training-points/logs?page=${page}&limit=30`);
            const res = raw?.data ? raw : { data: raw, meta: { page, limit: 30, total: 0, totalPages: 0 } };
            setLogs(Array.isArray(res.data) ? res.data : []);
            setLogsMeta(res.meta);
        } catch (err) {
            console.error("Failed to load logs:", err);
        } finally {
            setLogsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers(1);
    }, [loadUsers]);

    useEffect(() => {
        if (tab === "logs") loadLogs(1);
    }, [tab, loadLogs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const handleAdjustSubmit = async () => {
        if (!adjustUser || !adjustPoints) return;
        setAdjustLoading(true);
        try {
            await apiFetch(`/admin/users/${adjustUser.id}/training-points`, {
                method: "PATCH",
                body: JSON.stringify({
                    points: Number(adjustPoints),
                    reason: adjustReason || "Admin điều chỉnh",
                }),
            });
            setAdjustUser(null);
            setAdjustPoints("");
            setAdjustReason("");
            loadUsers(usersMeta.page);
            if (tab === "logs") loadLogs(logsMeta.page);
        } catch (err) {
            alert("Lỗi điều chỉnh điểm: " + (err as Error).message);
        } finally {
            setAdjustLoading(false);
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");
    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} phút trước`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} ngày trước`;
        return formatDate(dateStr);
    };

    // Top 3 stats
    const totalPointsAll = users.reduce((s, u) => s + (u.training_points ?? 0), 0);
    const topUser = users.length > 0 ? users.reduce((a, b) => (a.training_points ?? 0) >= (b.training_points ?? 0) ? a : b) : null;

    return (
        <main className="min-h-screen">
            <section className="p-8 max-w-7xl mx-auto space-y-8 pt-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
                            Quản Lý Điểm Rèn Luyện
                        </h2>
                        <p className="text-on-surface-variant mt-2 max-w-xl text-lg">
                            Theo dõi, điều chỉnh điểm rèn luyện của sinh viên. Điểm được cộng tự động khi trao trả thành công.
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
                                Tổng người dùng
                            </p>
                            <span className="material-symbols-outlined text-primary text-xl">group</span>
                        </div>
                        <h3 className="text-3xl font-black text-on-surface tracking-tighter">
                            {usersMeta.total}
                        </h3>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-white/30 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-widest font-black text-emerald-600">
                                Tổng điểm (trang này)
                            </p>
                            <span className="material-symbols-outlined text-emerald-500 text-xl">stars</span>
                        </div>
                        <h3 className="text-3xl font-black text-emerald-600 tracking-tighter">
                            {totalPointsAll}
                        </h3>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-primary-container p-5 rounded-2xl shadow-xl shadow-primary/20 overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-on-primary/70 text-[10px] font-bold uppercase tracking-widest mb-3">
                                Người dẫn đầu
                            </p>
                            <h3 className="text-xl font-black text-on-primary tracking-tighter truncate">
                                {topUser?.full_name ?? "—"}
                            </h3>
                            <p className="text-on-primary/60 text-xs mt-1">
                                {topUser?.training_points ?? 0} điểm
                            </p>
                        </div>
                        <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-on-primary/10">
                            emoji_events
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab("users")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            tab === "users"
                                ? "bg-[var(--color-accent)] text-white shadow-md"
                                : "admin-btn-inactive"
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm mr-1 align-middle">group</span>
                        Bảng điểm
                    </button>
                    <button
                        onClick={() => setTab("logs")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            tab === "logs"
                                ? "bg-[var(--color-accent)] text-white shadow-md"
                                : "admin-btn-inactive"
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm mr-1 align-middle">history</span>
                        Lịch sử thay đổi
                    </button>
                </div>

                {/* Users Tab */}
                {tab === "users" && (
                    <>
                        {/* Filters */}
                        <div className="flex gap-4 items-end flex-wrap">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên hoặc email..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="admin-input rounded-xl text-xs font-medium py-2.5 px-4 w-72"
                                />
                                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[var(--color-accent)] text-white text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">search</span>
                                </button>
                            </form>
                            <button
                                onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
                                className="px-4 py-2.5 rounded-xl admin-btn-inactive text-xs font-bold transition-all flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {sortDir === "desc" ? "arrow_downward" : "arrow_upward"}
                                </span>
                                Điểm {sortDir === "desc" ? "cao → thấp" : "thấp → cao"}
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="glass-card rounded-3xl border border-white/30 shadow-xl overflow-hidden">
                            {usersLoading ? (
                                <div className="flex items-center justify-center py-24">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low/50">
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Người dùng</th>
                                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Email</th>
                                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Role</th>
                                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Trạng thái</th>
                                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Điểm RL</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/10">
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-8 py-16 text-center text-on-surface-variant">
                                                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-2">search_off</span>
                                                        <p className="text-sm font-medium">Không tìm thấy người dùng.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map((u) => (
                                                    <tr key={u.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    className="w-9 h-9 rounded-full bg-surface-container-high object-cover"
                                                                    src={u.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=e8eaef&color=5f6368&bold=true&size=36`}
                                                                    alt={u.full_name}
                                                                />
                                                                <p className="text-sm font-bold text-on-surface">{u.full_name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-sm text-on-surface-variant">{u.email}</td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-[var(--color-bg-input)] text-slate-600"}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === "active" ? "bg-emerald-100 text-emerald-700" : u.status === "suspended" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                                                {u.status === "active" ? "Hoạt động" : u.status === "suspended" ? "Đã khóa" : "Chờ xác minh"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`text-lg font-black ${(u.training_points ?? 0) > 0 ? "text-emerald-600" : "text-on-surface-variant"}`}>
                                                                {u.training_points ?? 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <button
                                                                onClick={() => { setAdjustUser(u); setAdjustPoints(""); setAdjustReason(""); }}
                                                                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-bold hover:bg-primary/20 transition-all flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">edit</span>
                                                                Điều chỉnh
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {usersMeta.totalPages > 1 && (
                                <div className="px-8 py-6 bg-surface-container-high/30 flex items-center justify-between">
                                    <p className="text-xs font-bold text-on-surface-variant">
                                        Trang {usersMeta.page} / {usersMeta.totalPages} — Tổng {usersMeta.total} người dùng
                                    </p>
                                    <div className="flex gap-2">
                                        <button onClick={() => loadUsers(usersMeta.page - 1)} disabled={usersMeta.page <= 1}
                                            className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30">
                                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                                        </button>
                                        {Array.from({ length: Math.min(usersMeta.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                            <button key={p} onClick={() => loadUsers(p)}
                                                className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${usersMeta.page === p ? "bg-primary text-on-primary shadow-md shadow-primary/20" : "bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary"}`}>
                                                {p}
                                            </button>
                                        ))}
                                        <button onClick={() => loadUsers(usersMeta.page + 1)} disabled={usersMeta.page >= usersMeta.totalPages}
                                            className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30">
                                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Logs Tab */}
                {tab === "logs" && (
                    <div className="glass-card rounded-3xl border border-white/30 shadow-xl overflow-hidden">
                        {logsLoading ? (
                            <div className="flex items-center justify-center py-24">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low/50">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Người dùng</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Thay đổi</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Số dư sau</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Lý do</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Thời gian</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-16 text-center text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-2">history</span>
                                                    <p className="text-sm font-medium">Chưa có lịch sử điểm.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log) => (
                                                <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                className="w-8 h-8 rounded-full bg-surface-container-high object-cover"
                                                                src={log.users?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(log.users?.full_name ?? "U")}&background=e8eaef&color=5f6368&bold=true&size=32`}
                                                                alt={log.users?.full_name ?? "User"}
                                                            />
                                                            <div>
                                                                <p className="text-sm font-bold text-on-surface">{log.users?.full_name ?? "—"}</p>
                                                                <p className="text-[10px] text-on-surface-variant">{log.users?.email ?? ""}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`text-sm font-black ${log.points_delta > 0 ? "text-emerald-600" : "text-red-600"}`}>
                                                            {log.points_delta > 0 ? `+${log.points_delta}` : log.points_delta}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-bold text-on-surface">
                                                        {log.balance_after}
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-on-surface-variant max-w-[250px] truncate">
                                                        {log.reason}
                                                    </td>
                                                    <td className="px-6 py-5 text-xs text-on-surface-variant">
                                                        {formatTimeAgo(log.created_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {logsMeta.totalPages > 1 && (
                            <div className="px-8 py-6 bg-surface-container-high/30 flex items-center justify-between">
                                <p className="text-xs font-bold text-on-surface-variant">
                                    Trang {logsMeta.page} / {logsMeta.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button onClick={() => loadLogs(logsMeta.page - 1)} disabled={logsMeta.page <= 1}
                                        className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30">
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    <button onClick={() => loadLogs(logsMeta.page + 1)} disabled={logsMeta.page >= logsMeta.totalPages}
                                        className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30">
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Adjust Points Modal */}
            {adjustUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAdjustUser(null)}>
                    <div className="bg-surface rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 space-y-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <img
                                className="w-12 h-12 rounded-full bg-surface-container-high object-cover"
                                src={adjustUser.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(adjustUser.full_name)}&background=e8eaef&color=5f6368&bold=true&size=48`}
                                alt={adjustUser.full_name}
                            />
                            <div>
                                <p className="font-bold text-on-surface">{adjustUser.full_name}</p>
                                <p className="text-xs text-on-surface-variant">Hiện tại: <span className="font-bold text-emerald-600">{adjustUser.training_points ?? 0} điểm</span></p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant block mb-1">
                                    Số điểm (dương = cộng, âm = trừ)
                                </label>
                                <input
                                    type="number"
                                    value={adjustPoints}
                                    onChange={(e) => setAdjustPoints(e.target.value)}
                                    placeholder="VD: 5 hoặc -3"
                                    className="w-full admin-input rounded-xl text-sm font-bold py-3 px-4"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant block mb-1">
                                    Lý do
                                </label>
                                <input
                                    type="text"
                                    value={adjustReason}
                                    onChange={(e) => setAdjustReason(e.target.value)}
                                    placeholder="VD: Tham gia hoạt động tình nguyện"
                                    className="w-full admin-input rounded-xl text-sm font-medium py-3 px-4"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setAdjustUser(null)}
                                className="px-5 py-2.5 rounded-xl admin-btn-inactive text-sm font-bold transition-all"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAdjustSubmit}
                                disabled={!adjustPoints || adjustLoading}
                                className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
                            >
                                {adjustLoading ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
