"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";

interface UserRow {
    id: string;
    full_name: string;
    email: string;
    role: string;
    status: string;
    training_points: number;
    created_at: string;
}

interface UsersMeta {
    page: number;
    limit: number;
    total: number;
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [meta, setMeta] = useState<UsersMeta>({ page: 1, limit: 20, total: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await apiFetch<{ data: UserRow[]; meta: UsersMeta }>(
                `/admin/users?page=${page}&limit=20`
            );
            setUsers(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.error("Failed to load users:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers(1);
    }, [loadUsers]);

    const handleSuspend = async (userId: string) => {
        if (!confirm("Bạn có chắc muốn khóa tài khoản này?")) return;
        setActionLoading(userId);
        try {
            await apiFetch(`/admin/users/${userId}/suspend`, { method: "PATCH" });
            await loadUsers(meta.page);
        } catch (err) {
            alert("Lỗi khi khóa tài khoản: " + (err as Error).message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleActivate = async (userId: string) => {
        setActionLoading(userId);
        try {
            await apiFetch(`/admin/users/${userId}/activate`, { method: "PATCH" });
            await loadUsers(meta.page);
        } catch (err) {
            alert("Lỗi khi mở khóa tài khoản: " + (err as Error).message);
        } finally {
            setActionLoading(null);
        }
    };

    const totalPages = Math.ceil(meta.total / meta.limit);

    // Stats computed from meta
    const totalUsers = meta.total;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const suspendedUsers = users.filter((u) => u.status === "suspended").length;
    const pendingUsers = users.filter((u) => u.status === "pending_verify").length;

    return (
        <main className="pb-12 px-8 min-h-screen pt-8">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                        Quản Lý Người Dùng
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                        Quản lý tài khoản người dùng, khóa/mở khóa tài khoản. Dữ liệu trực tiếp từ database.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-surface-container-low px-4 py-2.5 rounded-full flex items-center gap-2 text-on-surface-variant font-semibold text-sm">
                        <span className="material-symbols-outlined text-lg">group</span>
                        Tổng: {totalUsers} người dùng
                    </div>
                </div>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        Tổng Người Dùng
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter">
                            {totalUsers.toLocaleString()}
                        </h3>
                        <span className="material-symbols-outlined text-primary">group</span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        Đang Hoạt Động
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter text-emerald-600">
                            {activeUsers}
                        </h3>
                        <span className="material-symbols-outlined text-emerald-500">
                            check_circle
                        </span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        Đã Khóa
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter text-red-600">
                            {suspendedUsers}
                        </h3>
                        <span className="material-symbols-outlined text-red-400">lock</span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        Chờ Xác Minh
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter text-amber-600">
                            {pendingUsers}
                        </h3>
                        <span className="material-symbols-outlined text-amber-400">
                            hourglass_top
                        </span>
                    </div>
                </div>
            </div>

            {/* User Table */}
            <section className="glass-panel rounded-lg shadow-sm overflow-hidden border border-outline-variant/5">
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">
                        Danh Sách Người Dùng
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low/50 text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Người dùng</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4">Điểm RL</th>
                                    <th className="px-6 py-4">Ngày đăng ký</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-16 text-center text-on-surface-variant"
                                        >
                                            Không có dữ liệu người dùng.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="group hover:bg-surface-container-low/30 transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="h-10 w-10 rounded-full bg-surface-container-high object-cover"
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=e8eaef&color=5f6368&bold=true`}
                                                        alt={u.full_name}
                                                    />
                                                    <p className="font-bold text-sm">{u.full_name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-on-surface-variant">
                                                {u.email}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        u.role === "admin"
                                                            ? "bg-indigo-100 text-indigo-700"
                                                            : u.role === "storage_staff"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        u.status === "active"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : u.status === "suspended"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {u.status === "active"
                                                        ? "Hoạt động"
                                                        : u.status === "suspended"
                                                        ? "Đã khóa"
                                                        : "Chờ xác minh"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold">
                                                {u.training_points}
                                            </td>
                                            <td className="px-6 py-5 text-sm text-on-surface-variant">
                                                {new Date(u.created_at).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {u.role !== "admin" && (
                                                        <>
                                                            {u.status === "active" ? (
                                                                <button
                                                                    onClick={() => handleSuspend(u.id)}
                                                                    disabled={actionLoading === u.id}
                                                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all disabled:opacity-50 flex items-center gap-1"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">
                                                                        lock
                                                                    </span>
                                                                    Khóa
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleActivate(u.id)}
                                                                    disabled={actionLoading === u.id}
                                                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all disabled:opacity-50 flex items-center gap-1"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">
                                                                        lock_open
                                                                    </span>
                                                                    Mở khóa
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 bg-surface-container-low/20 flex items-center justify-between">
                        <p className="text-xs text-on-surface-variant font-medium">
                            Trang {meta.page} / {totalPages} — Tổng {meta.total.toLocaleString()} người dùng
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => loadUsers(meta.page - 1)}
                                disabled={meta.page <= 1}
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    chevron_left
                                </span>
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                                (p) => (
                                    <button
                                        key={p}
                                        onClick={() => loadUsers(p)}
                                        className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                            meta.page === p
                                                ? "bg-primary text-on-primary"
                                                : "bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                            <button
                                onClick={() => loadUsers(meta.page + 1)}
                                disabled={meta.page >= totalPages}
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}