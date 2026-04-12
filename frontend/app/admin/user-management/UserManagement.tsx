export default function UserManagement() {
    return (
        <main className="pb-12 px-8 min-h-screen pt-8">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                        Trust & Reliability
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                        Oversee community integrity and contribution metrics. Manage user
                        profiles based on verified behaviors and trust scoring.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-surface-container-lowest text-primary font-bold rounded-full border border-outline-variant/15 hover:bg-surface-container-low transition-colors shadow-sm">
                        Export Audit Log
                    </button>
                    <button className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all">
                        Verify New KYC
                    </button>
                </div>
            </header>

            {/* Bento Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        Total Verified Users
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter">12,842</h3>
                        <span className="text-primary text-xs font-bold mb-1">
                            +12% vs last month
                        </span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        Avg Trust Score
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter">84.2</h3>
                        <div className="flex text-amber-500 mb-1">
                            <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                star
                            </span>
                            <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                star
                            </span>
                            <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                star
                            </span>
                            <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                star
                            </span>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        KYC Pending
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter">156</h3>
                        <span className="bg-error-container/20 text-error-dim px-2 py-0.5 rounded text-[10px] font-bold mb-1 uppercase tracking-wider">
                            Urgent
                        </span>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/5">
                    <p className="text-on-surface-variant text-sm font-medium mb-1">
                        Items Recovered
                    </p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold tracking-tighter">3,109</h3>
                        <span className="material-symbols-outlined text-indigo-400">
                            inventory_2
                        </span>
                    </div>
                </div>
            </div>

            {/* User Trust Table Section */}
            <section className="glass-panel rounded-lg shadow-sm overflow-hidden border border-outline-variant/5">
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">
                        Active Community Members
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                        <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                            <span className="material-symbols-outlined">download</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low/50 text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">User Identity</th>
                                <th className="px-6 py-4">Contributions</th>
                                <th className="px-6 py-4">Trust Score Breakdown</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {/* User Row 1 */}
                            <tr className="group hover:bg-surface-container-low/30 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-secondary-container overflow-hidden">
                                            <img
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF1GPfsLiQKXZhpuMw7YR8OD7-8HADCmfNA9FfwDRjXbihjXvD8dF2Q3Mhpw4EEburPXNHrhmFSNLpstDXR2qtHBqnSTX35ZE85WPn5xermxQHeo2igqRECFz0PxG4G9GE859bg_sq1JM5-Zt9hMqeUoq_SBWrcsCcZuC4JquzVBkG1jDa3GaBlpnOvQoNq7-rTCWOoFoBwSsfuJfxjEJfLjqg7Cr_iLabuC_7cA5lKpj36CVx5DHZOhyW99qEfqmEwXguGwqKYMc"
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Nguyen Minh Anh</p>
                                            <p className="text-xs text-on-surface-variant">
                                                minhanh.ng@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">42 found</span>
                                        <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                                            12 returned
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 flex items-center justify-center">
                                            <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                                                <circle
                                                    className="text-surface-container-high"
                                                    cx="24"
                                                    cy="24"
                                                    fill="transparent"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <circle
                                                    className="text-primary"
                                                    cx="24"
                                                    cy="24"
                                                    fill="transparent"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeDasharray="125.6"
                                                    strokeDashoffset="12.5"
                                                    strokeWidth="4"
                                                ></circle>
                                            </svg>
                                            <span className="text-xs font-black">94</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-emerald-500"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    verified
                                                </span>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    KYC (+50)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-indigo-500"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    handshake
                                                </span>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    Returns (+44)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                        Elite Tier
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-surface-container-highest rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all">
                                            <span className="material-symbols-outlined text-sm">
                                                edit
                                            </span>
                                        </button>
                                        <button className="p-2 bg-surface-container-highest rounded-lg text-error hover:bg-error hover:text-on-error transition-all">
                                            <span className="material-symbols-outlined text-sm">
                                                flag
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* User Row 2 */}
                            <tr className="group hover:bg-surface-container-low/30 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-tertiary-container overflow-hidden">
                                            <img
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDULhMNi2zNUSNIjj0qNVGQv_DmioczFSr7jWhCbundLYJ2qC3DXT3B5eoIvgXkADct9sb0gL2KV-_9Qeq9ZKyRRE--6jbsQc6ww-Jsa0383JnSP9pay3ZC8oeP-I4nzDTxG9ffNrufEE9XHUT948-LF_QVVFoqvoziwYiUiqILx6U8u0c9uIwLrkwvxmt2U4WSzMpF8l2tHKRRNqa5FtDOwonl4w8EOclqw32zg2gQ1YkWxkc8qfao6KH5fUkFR7XpUindIwc5Y7s"
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Tran Hoang Nam</p>
                                            <p className="text-xs text-on-surface-variant">
                                                nam.tran.dev@outlook.com
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">8 found</span>
                                        <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                                            1 returned
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 flex items-center justify-center">
                                            <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                                                <circle
                                                    className="text-surface-container-high"
                                                    cx="24"
                                                    cy="24"
                                                    fill="transparent"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <circle
                                                    className="text-amber-500"
                                                    cx="24"
                                                    cy="24"
                                                    fill="transparent"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeDasharray="125.6"
                                                    strokeDashoffset="52.5"
                                                    strokeWidth="4"
                                                ></circle>
                                            </svg>
                                            <span className="text-xs font-black">58</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-emerald-500"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    verified
                                                </span>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    KYC (+50)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-slate-400">
                                                    handshake
                                                </span>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    Returns (+8)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                                        Verified
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-surface-container-highest rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all">
                                            <span className="material-symbols-outlined text-sm">
                                                edit
                                            </span>
                                        </button>
                                        <button className="p-2 bg-surface-container-highest rounded-lg text-error hover:bg-error hover:text-on-error transition-all">
                                            <span className="material-symbols-outlined text-sm">
                                                flag
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* User Row 3 */}
                            <tr className="group hover:bg-surface-container-low/30 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-outline-variant overflow-hidden">
                                            <img
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAipAO7Y2SVhlmexlG36hE4wjxVhJ5OwhzpB83XOCrcua0M6p0mnN7zxErvq7oVl9_cFf1p5yLY6lO6WF6VXlKrdh5AMnFqJoen2f735iHbEdbk4cnfk7ZvLeTmKFU_6fJOYRgpJHVzyYAyfriMY3pgFux7JiIPiq6cXjCl0TCLh_77pv2ZUIjIe2i83hupp_8hoPS4M2IWABrxsVeg0LmznWKDr7-Gi0JO5890w_nl3B2XKatFL38ImOfXugYelmKHKHIiVds8dEs"
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Le Quoc Khanh</p>
                                            <p className="text-xs text-on-surface-variant">
                                                khanh_unknown@test.vn
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">1 found</span>
                                        <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                                            0 returned
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 flex items-center justify-center">
                                            <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                                                <circle
                                                    className="text-surface-container-high"
                                                    cx="24"
                                                    cy="24"
                                                    fill="transparent"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <circle
                                                    className="text-error"
                                                    cx="24"
                                                    cy="24"
                                                    fill="transparent"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeDasharray="125.6"
                                                    strokeDashoffset="110.5"
                                                    strokeWidth="4"
                                                ></circle>
                                            </svg>
                                            <span className="text-xs font-black">12</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px] text-slate-300">
                                                    verified
                                                </span>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    KYC (+0)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-error"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    report
                                                </span>
                                                <span className="text-[11px] font-medium text-error-dim">
                                                    Reports (-30)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-error-container/20 text-error-dim rounded-full text-xs font-bold">
                                        Suspended
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-surface-container-highest rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all">
                                            <span className="material-symbols-outlined text-sm">
                                                edit
                                            </span>
                                        </button>
                                        <button className="p-2 bg-error text-on-error rounded-lg transition-all">
                                            <span className="material-symbols-outlined text-sm">
                                                lock_open
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Table Footer / Pagination */}
                <div className="p-6 bg-surface-container-low/20 flex items-center justify-between">
                    <p className="text-xs text-on-surface-variant font-medium">
                        Showing 1 to 10 of 12,842 users
                    </p>
                    <div className="flex gap-2">
                        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">
                                chevron_left
                            </span>
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-on-primary text-xs font-bold">
                            1
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold">
                            2
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold">
                            3
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">
                                chevron_right
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Contextual Activity Insights */}
            <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-lg shadow-sm border border-outline-variant/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-500">
                            verified_user
                        </span>
                        Verification Queue
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-500">
                                        person
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Identity Doc - ID: #8291</p>
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                                        Submitted 2h ago
                                    </p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">
                                Review Docs
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-500">
                                        person
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">
                                        Selfie Verification - ID: #8304
                                    </p>
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                                        Submitted 4h ago
                                    </p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">
                                Review Docs
                            </button>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-lg shadow-sm border border-outline-variant/5 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">Trust System Health</h3>
                        <p className="text-sm text-on-surface-variant mb-6">
                            Real-time analysis of community interaction quality and fraudulent
                            report detection.
                        </p>
                        <div className="space-y-4">
                            <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full w-[92%]"></div>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-on-surface-variant">
                                <span>RELIABILITY SCORE</span>
                                <span className="text-indigo-600">92%</span>
                            </div>
                            <p className="text-xs leading-relaxed italic opacity-80">
                                "Community trust is at an all-time high this quarter. KYC
                                adoption has increased by 14% since the last update."
                            </p>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -right-12 -bottom-12 h-48 w-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
                </div>
            </section>
        </main>
    );
}