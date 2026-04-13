export default function PostManagement() {
    return (
        <main className="min-h-screen">
            <section className="p-8 max-w-7xl mx-auto space-y-8 pt-8">
                {/* Hero / Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
                            Post Management
                        </h2>
                        <p className="text-on-surface-variant mt-2 max-w-xl text-lg">
                            Central oversight of all lost and found reports. Maintain
                            community safety and data integrity.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-surface-container-lowest px-4 py-2 rounded-2xl glass-card flex items-center gap-4 shadow-sm border border-white/50">
                            <div className="flex -space-x-3">
                                <img
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5sCy3xqY6ec9Brb9Ms2geEVn6c1eX8Bqh1UJJvCYCGA-xgs5gFjrqq4-U2Lo6JKRlYwf1VMlIvbuJTWqJO-fqaoBmIokouGOmAUJkA2eH4L6NZHmOTC1BAtdpCUcBjtB1fbCjV1-E_QIEXNFBdYPFw7Nh_CFQIYMZPJtOvAkC-0zXWemmbHSukL1L7yJZmk0OeJdaGz1MWQsTyIePOsODAIXVjzpniOE80v8Kl2qAJZchjLpxKMbnq-s7AGy0cxHAU2XyI0MmoiQ"
                                    alt="user 1"
                                />
                                <img
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzCsFtObSh37b1UASvcAVU1hjGzI5rqZa4sr4ueRLHyiu19DAlDXkVuC5mkmNSM8kjqGxg1hjaFnOi0J2vWSf1kdSBWLEEtbbm1t-UPxnesvOFJFXEwIRxApVlyorINnKraopwHtL4cVKxCNntb-ue03rQbhZRCDUGZSXg6jhWeLAAzCGVsHxORHYNAznJtIqJXKbueBGJYktkTueGtVQ-HzAoL784LMv-njnAkhrSapf3ZzKGs2jQ1DUN1H_ZVBwovZkflyzeX1o"
                                    alt="user 2"
                                />
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-[10px] font-bold text-on-secondary-container">
                                    +12
                                </div>
                            </div>
                            <span className="text-xs font-bold text-on-surface-variant">
                                42 Active Moderators
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filter Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-1 bg-surface-container-lowest glass-card p-6 rounded-2xl border border-white/50 shadow-sm flex flex-col justify-between">
                        <label className="text-[10px] uppercase tracking-widest font-black text-primary mb-2 block">
                            Filter by Type
                        </label>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20">
                                All
                            </button>
                            <button className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high text-on-surface-variant text-xs font-bold hover:bg-surface-container-highest transition-colors">
                                Lost
                            </button>
                            <button className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high text-on-surface-variant text-xs font-bold hover:bg-surface-container-highest transition-colors">
                                Found
                            </button>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1 bg-surface-container-lowest glass-card p-6 rounded-2xl border border-white/50 shadow-sm">
                        <label className="text-[10px] uppercase tracking-widest font-black text-primary mb-2 block">
                            Category
                        </label>
                        <select className="w-full bg-surface-container-high border-none rounded-xl text-xs font-bold text-on-surface-variant focus:ring-primary/20">
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Pets</option>
                            <option>Documents</option>
                            <option>Keys & Wallets</option>
                        </select>
                    </div>
                    <div className="col-span-1 md:col-span-1 bg-surface-container-lowest glass-card p-6 rounded-2xl border border-white/50 shadow-sm">
                        <label className="text-[10px] uppercase tracking-widest font-black text-primary mb-2 block">
                            Date Range
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-on-surface-variant text-sm">
                                calendar_month
                            </span>
                            <span className="text-xs font-bold text-on-surface-variant">
                                Last 30 Days
                            </span>
                            <span className="material-symbols-outlined text-on-surface-variant text-sm ml-auto cursor-pointer">
                                expand_more
                            </span>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-primary to-primary-dim p-6 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between group cursor-pointer overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                                Live Updates
                            </p>
                            <p className="text-white text-2xl font-black">24 New</p>
                        </div>
                        <span
                            className="material-symbols-outlined text-white/20 text-6xl absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform duration-500"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            bolt
                        </span>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-surface-container-lowest glass-card rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                        Item Name
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                        Type
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                        Reporter
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                        Date Posted
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                        Status
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {/* Row 1 */}
                                <tr className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5665ZDU8xmY_PTzYlL0vleCdjve7NL1FwaUDAFLfzFoRsoUagq3vxAz-M6NKhgrZvw77Rm-oRREVLZHwT_zTqtrWou14dAJyPhdnNo4vNTZ8hyFbsXTGuZa17cmJsbjP_8hbYCpI2bmOxL9PSgJIbg3AUoMTw5WyfdW7AngNT0G8hVYoJlMH_iXeS-DgAT4gqwpRYTcYS6YaNS_4HTUvddOsXpK-XOwrww5-YkJrKyysalATZ5lwpXp_xO488X2mk3pNDsJQOz2g"
                                                    alt="iPhone"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">
                                                    iPhone 13 Pro Max
                                                </p>
                                                <p className="text-[11px] text-on-surface-variant font-medium">
                                                    Electronics • Sierra Blue
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-error-container/10 text-error">
                                            Lost
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="w-6 h-6 rounded-full"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc2k2361f3f24W1wFVVAppcGDqKih_bDtdlMMS4_SYCx4Ua6Rjs5dtemxMLmOvtWj8BfHb01oB7cv5wfxitoOLa3djG5oKUufPATwCd2aASifpcNtNDJs3XGxoeQl0t72064QaDDpJKZALab2SO55eH1gjr31naCkplMAJDbFoojx54JDxtlG8gsrAVmRGhPcrkzbouXrxqwgU-9sg_3PEULehkgV2I0nGS4jOvZZja33CS8HaaDG2qicnd29EFt77f81U7YTuZ8Q"
                                                alt="James"
                                            />
                                            <span className="text-sm font-medium text-on-surface-variant">
                                                James Wilson
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-on-surface-variant">
                                            Oct 24, 2023
                                        </p>
                                        <p className="text-[10px] text-outline italic">
                                            2 hours ago
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-sm font-bold text-primary">
                                                Active
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <a
                                            className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                            href="#"
                                        >
                                            View Details
                                            <span className="material-symbols-outlined text-sm">
                                                arrow_forward
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfZ41kBdvwX08f9c0oBqr1oGPeSiYD497fkSLndx3TE_7OHZCc20jx5n-clncm0jg5At_We5qh4N2y9NczUhwqKYgDy3yDqURdg56hR_mHfkGsvsSSbJ2irQyHzrU63Bp3TK-ZfUxE7eeroEDeacnCRPnhIdf4K9tXVXQMpUerZzCsXFkHExhxtjYnnonFqqRWO94uE8K9hFEboE-R54oW7puFk3L0mnkpPN_ZMR9i-fR3_cLzvF8EV8-sAaChPFMnoWbg18r2Nts"
                                                    alt="Golden Retriever"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">
                                                    Golden Retriever
                                                </p>
                                                <p className="text-[11px] text-on-surface-variant font-medium">
                                                    Pets • Near Central Park
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container/30 text-secondary">
                                            Found
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="w-6 h-6 rounded-full"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1pTgJlwoWSh4GcELUvWCg1WB5tpdB-zrXfl1HtwxdCU7dnYrtPkIUUyIBlLDT2ne9P9hrZ51L7ZpEInGk3TtJt53xkG5NBUpk75SqKkkd3UFN8P86gPd9l138qhxpMRw_pZ6oJSCjFhk9pl5slZdXkO3JBpCzjnEJ7kn56R-xGKvFc5xg0lJXAu6kxPUEmaIKpkBT9gdmzn06w7SGqsMm2ML24akrqCaacTSsLr9N4Q9kcm88kiJU9isI-6ctcUY3HIJsugfoLwg"
                                                alt="Sarah"
                                            />
                                            <span className="text-sm font-medium text-on-surface-variant">
                                                Sarah Chen
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-on-surface-variant">
                                            Oct 23, 2023
                                        </p>
                                        <p className="text-[10px] text-outline italic">Yesterday</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                                            <span className="text-sm font-bold text-on-surface-variant opacity-60">
                                                Resolved
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <a
                                            className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                            href="#"
                                        >
                                            View Details
                                            <span className="material-symbols-outlined text-sm">
                                                arrow_forward
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB2jITDcaEIvFPA9PiNo-KVXFhISY0lPaNEGmUwgi3hsGWQITIWXQXP-QzEakHsssmyH3FvUZ0R2C1mRWHYL1sJfLaCmRDtk5cpRvwODCy-VmRzYq8WHuF_5hqwTXiw1sjsW-AY_1_-ek2XKQktp0nqcyzeNLwuvP3i7gB-URrne5hCSdnwBJNhhPUd5N1xiXqfbXxmbh_glgDw3kgNJrJRrBWcd0hJs_Er4RRvWnx8nKeHBmXW2pRZp757kB_G_OSulsIUF07VXg"
                                                    alt="Wallet"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">
                                                    Leather Wallet
                                                </p>
                                                <p className="text-[11px] text-on-surface-variant font-medium">
                                                    Accessories • Black Leather
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-error-container/10 text-error">
                                            Lost
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="w-6 h-6 rounded-full"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4UZHRzVCl-ZNMjrlgKRgIavY_lOjSwWR4WxJ8vhYCIddCL8rk4z6QSinvc5cmgGahzqpTwKKr3TSb5gnN6dwL0X6Tem8tzj7fT3r6V91ZwzYz0aoAP6WV2ZdmnaO9XyoR1tywDi1VimuR7j5XZJNj6qknrFMflsNPzZ5rbktuICCKEwcNrcmwNGm8OxD6C1dMnaD2vHQsxqiNXb5JW3TJMLOaEVXJZpWJOigUgfogxNKTnYhm_Buj8SFBpVTzphGJUMDRuhaFNaM"
                                                alt="Marcus"
                                            />
                                            <span className="text-sm font-medium text-on-surface-variant">
                                                Marcus T.
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-on-surface-variant">
                                            Oct 21, 2023
                                        </p>
                                        <p className="text-[10px] text-outline italic">
                                            3 days ago
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-error"></div>
                                            <span className="text-sm font-bold text-error">
                                                Flagged
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <a
                                            className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                            href="#"
                                        >
                                            View Details
                                            <span className="material-symbols-outlined text-sm">
                                                arrow_forward
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                                {/* Row 4 */}
                                <tr className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ23_FA7jJiq5ebpn-QEcqhqKHjN-Zg9b5G3xQu84KtfaMZ89cOdDWDK8RZdvNYr69wiyHaysYkWj3VYj_dN3kJOf_Pv0n0zddTwZ3L25L0_F7p_paAsC1gaS0I0EMlpURdzuwMZTe5FiKRQDE4IvBVhCalx5UXfPWkD56I_Llaydl5RbsjPrfrO_HT4Aob0S4KSZaK9-HyM8Rd89p5bayuEM2aoJdoRafb2EiPp_AuAvEZ2l_D4QxLIgKGsMCwd3auo45zxIqcSc"
                                                    alt="Car Keys"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">
                                                    Car Keys (Toyota)
                                                </p>
                                                <p className="text-[11px] text-on-surface-variant font-medium">
                                                    Keys • Metro Station
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container/30 text-secondary">
                                            Found
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="w-6 h-6 rounded-full"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwcHzYs7QbZO-3aBxYKjIssJNa5twyg_XbcmwZ3t-VQ1Kdbov87nsSTf8gEkm1Mum7lB9cD87t0p-jZRYfKMlJ1WP37-gS5eRIdI4o-x9RNV7Rut_mooDbjfR6m4O6eX_-wju-N78LNQFZnabIy7XVZH1Uz2LDnMuzcH1cw69DKeuLRDFfCFYzzXpGC_zWH6m25kqaqyHO2jjfYX_k8_79JW0INtB_R6DkPRKlpAT23EMLBzz1uVr16pPvYNupV3y3H2Iu1au8Jo4"
                                                alt="Elena"
                                            />
                                            <span className="text-sm font-medium text-on-surface-variant">
                                                Elena Rossi
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-on-surface-variant">
                                            Oct 20, 2023
                                        </p>
                                        <p className="text-[10px] text-outline italic">
                                            4 days ago
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-sm font-bold text-primary">
                                                Active
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <a
                                            className="text-primary font-bold text-xs hover:underline inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                            href="#"
                                        >
                                            View Details
                                            <span className="material-symbols-outlined text-sm">
                                                arrow_forward
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-surface-container-high/30 flex items-center justify-between">
                        <p className="text-xs font-bold text-on-surface-variant">
                            Showing 1-10 of 1,240 posts
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full bg-[var(--color-bg-card-solid)] text-on-surface-variant hover:bg-primary hover:text-white shadow-sm transition-all">
                                <span className="material-symbols-outlined text-sm">
                                    chevron_left
                                </span>
                            </button>
                            <button className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md shadow-primary/20">
                                1
                            </button>
                            <button className="w-8 h-8 rounded-full bg-[var(--color-bg-card-solid)] text-on-surface-variant text-xs font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                2
                            </button>
                            <button className="w-8 h-8 rounded-full bg-[var(--color-bg-card-solid)] text-on-surface-variant text-xs font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                3
                            </button>
                            <button className="p-2 rounded-full bg-[var(--color-bg-card-solid)] text-on-surface-variant hover:bg-primary hover:text-white shadow-sm transition-all">
                                <span className="material-symbols-outlined text-sm">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats/Insight Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface-container-lowest glass-card p-6 rounded-3xl border border-white/50 shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                                Resolution Rate
                            </p>
                            <h3 className="text-3xl font-black text-on-surface">68%</h3>
                            <p className="text-xs text-on-surface-variant mt-2">
                                +12% from last month
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest glass-card p-6 rounded-3xl border border-white/50 shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-error mb-1">
                                Flagged Items
                            </p>
                            <h3 className="text-3xl font-black text-on-surface">14</h3>
                            <p className="text-xs text-on-surface-variant mt-2">
                                Requires moderator review
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest glass-card p-6 rounded-3xl border border-white/50 shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">
                                Total Categories
                            </p>
                            <h3 className="text-3xl font-black text-on-surface">32</h3>
                            <p className="text-xs text-on-surface-variant mt-2">
                                Spanning 15 cities
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}