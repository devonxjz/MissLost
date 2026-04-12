export default function AdminOverview() {
    return (
        <main className="p-8 space-y-8">
            {/* Header Section */}
            <section className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
                        System Overview
                    </h1>
                    <p className="text-on-surface-variant mt-1">
                        Real-time tracking of community impact and logistics.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-2 text-on-surface-variant font-semibold">
                        <span className="material-symbols-outlined text-lg">
                            calendar_today
                        </span>
                        Last 30 Days
                    </div>
                </div>
            </section>

            {/* Bento Grid Statistics */}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Total Lost */}
                <div className="glass-card p-6 rounded-lg shadow-sm flex flex-col justify-between h-40 group hover:shadow-indigo-500/10 transition-all border-none">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <span className="material-symbols-outlined">search_off</span>
                        </div>
                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                            +12%
                        </span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant text-sm font-medium">
                            Total Lost Posts
                        </p>
                        <p className="text-3xl font-black text-on-surface">1,482</p>
                    </div>
                </div>

                {/* Total Found */}
                <div className="glass-card p-6 rounded-lg shadow-sm flex flex-col justify-between h-40 hover:shadow-indigo-500/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                check_circle
                            </span>
                        </div>
                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                            +18%
                        </span>
                    </div>
                    <div>
                        <p className="text-on-surface-variant text-sm font-medium">
                            Total Found Posts
                        </p>
                        <p className="text-3xl font-black text-on-surface">894</p>
                    </div>
                </div>

                {/* Success Rate */}
                <div className="glass-card p-6 rounded-lg shadow-sm flex flex-col justify-between h-40 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-on-primary">
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <p className="text-on-primary/80 font-medium">
                            System Health: Excellent
                        </p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-on-primary/80 text-sm font-medium">
                            Reunion Success Rate
                        </p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-5xl font-black">64.2%</p>
                            <span className="text-on-primary/60 text-xs font-bold">
                                AVG. 4 DAYS TO REUNION
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

            {/* Chart and Recent Activity */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Growth Chart Section */}
                <div className="lg:col-span-3 glass-card p-8 rounded-lg">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Platform Growth</h3>
                            <p className="text-on-surface-variant text-sm">
                                Monthly user and post engagement
                            </p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-primary"></span> Posts
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-200"></span>{" "}
                                Users
                            </div>
                        </div>
                    </div>
                    {/* Mock Chart Visualization */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        <div className="w-full bg-indigo-100 rounded-t-lg h-[40%] hover:bg-primary transition-colors cursor-pointer relative group">
                            <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white px-2 py-1 rounded text-[10px]">
                                1.2k
                            </div>
                        </div>
                        <div className="w-full bg-indigo-100 rounded-t-lg h-[55%] hover:bg-primary transition-colors cursor-pointer relative group"></div>
                        <div className="w-full bg-indigo-100 rounded-t-lg h-[45%] hover:bg-primary transition-colors cursor-pointer relative group"></div>
                        <div className="w-full bg-indigo-100 rounded-t-lg h-[70%] hover:bg-primary transition-colors cursor-pointer relative group"></div>
                        <div className="w-full bg-indigo-100 rounded-t-lg h-[65%] hover:bg-primary transition-colors cursor-pointer relative group"></div>
                        <div className="w-full bg-primary rounded-t-lg h-[85%] relative group">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white px-2 py-1 rounded text-[10px] font-bold">
                                2.4k
                            </div>
                        </div>
                        <div className="w-full bg-indigo-100 rounded-t-lg h-[75%] hover:bg-primary transition-colors cursor-pointer relative group"></div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span className="text-primary">Jun</span>
                        <span>Jul</span>
                    </div>
                </div>

                {/* Side Bento Element: Quick Stats */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="glass-card p-6 rounded-lg flex-1 flex flex-col justify-center text-center">
                        <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-2">
                            Active Users Now
                        </p>
                        <p className="text-5xl font-black text-primary">2,842</p>
                        <div className="mt-4 flex -space-x-3 justify-center">
                            <img
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfPoVBxb-_32-TcJz2X7yqlipdAY6kD1QBZCuigrc0buI8DX8qM-4u4HEY75gGknTuCVS567FImY1u8IQZXLPiWxllMb3SqQ95cBZwkmfiTlt_-N74XrZHVGr2crYI1XpO3zvn-ACtoBYaG0dEX_sQU2_Wjix2ZuipbujmgBiz9okJs7o3DiPzpwSnCk8NTWHNp7cqNazHbGkAtAIjBbxM1SDJJM51jJmXiFwfglhoofJbvwGTW6DegpMLKt2hLXn0yTBBbHnB9z0"
                                alt="user 1"
                            />
                            <img
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwjKERazqxEKYxHMqAThlw8YS7KzTNitcpo5hFV14UNZw2JlRjfMCyOmQuYbH4Ioa2Mm7Mr8e7JQdCb4NO-zkMof6H_6vhkoal1MNuh9KCZb-JxpwGUKLNkblGZzWfpd5yI-OlV8AkPtOaCQ7amikLuYYXQdykvZDQWfxP59zNACxt3uOsyDE-_Rvy8fuE5dXbTa3d9DT94Xpyaj6joRK_ODHRRvrgubzeCizmFulLbP9PRRTy13WwEueVUu5QVmCEn3K5dPxjUPs"
                                alt="user 2"
                            />
                            <img
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ7Tx5FSqSuN_BaZUwmKJniuDOVFPRjJh7iRbvcUJFw8E9fpgU-2Aqgw8anZY4-CP1ln-ifC7yf3zFgv_4g1EAnbG3sCTUioWMI8b4s492TmMi7slAqgEkQhk9PbzwLmoUaJ3s9XrKAyVkOkD-OHidB1bv7GmzBWq89A3ChLFulAKXo3FO40YdIIgGHq1EHqlr8I9s8C6A3jmX_WU8tRl9WPOVOvK_bFzmxxyLRZEp73qf8ZFdp2vmYm76QDo12diUoSQu0Byp2LU"
                                alt="user 3"
                            />
                            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">
                                +41
                            </div>
                        </div>
                    </div>
                    <div className="bg-indigo-600 rounded-lg p-6 text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <h4 className="font-bold text-lg">Safety Milestone</h4>
                            <p className="text-white/80 text-sm mt-1">
                                10,000 pets successfully reunited through MissLost since launch.
                            </p>
                            <button className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold transition-all">
                                View Hall of Fame
                            </button>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl text-white/10 group-hover:scale-110 transition-transform">
                            pets
                        </span>
                    </div>
                </div>
            </section>

            {/* Recent Posts for Review */}
            <section className="glass-card rounded-lg overflow-hidden shadow-sm">
                <div className="p-8 flex justify-between items-center border-b border-on-surface/5">
                    <div>
                        <h3 className="text-xl font-bold">Latest System Activity</h3>
                        <p className="text-on-surface-variant text-sm">
                            A summary of recent reports and platform updates.
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low/50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                <th className="px-8 py-4">Item/Pet</th>
                                <th className="px-8 py-4">Reporter</th>
                                <th className="px-8 py-4">Location</th>
                                <th className="px-8 py-4">Date</th>
                                <th className="px-8 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-on-surface/5">
                            <tr className="hover:bg-surface-container-low transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            className="w-12 h-12 rounded-lg object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkx1NLhhltNDWJV9xML01-WtXVCFBOAozIGxWIkePqHVLrf2gemoSeBC0Z2NGJjcIt0nWzrKLwWRzl4nkHYDCa1AJ9jaJOBhu8zjXETJv-QXoiHUT5kzOCc1qQ3hZzG1Vw5pxJS5d9iP950uE0cTwG14uXme4LEHnEQanhtmKuESwFEFC5SH58g8krjOzb4th4CXBPgOrG7STe2-R1v1EadHo-26b0XYAIVhtpXMQO3aUFGIiyefCtw_eIUCGYnQt8HS3eVFrUXtA"
                                            alt="Golden Retriever"
                                        />
                                        <div>
                                            <p className="font-bold text-on-surface">
                                                Golden Retriever
                                            </p>
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                                LOST
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Sarah Jenkins
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Brooklyn, NY
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Oct 12, 2023
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end">
                                        <span className="px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">
                                            Pending Review
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-surface-container-low transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            className="w-12 h-12 rounded-lg object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbkQDpD3zVy4qbI6iqzU9O-H25wXz093a_cnNXAzbno_ksSat5Z_5ACT2GN_S5f4nHsxlMupcnx-zxywoW7eDDTy4GI-Y9pSqA0QvRIgjgYBHgMC4hpbjKp0SqNsgCuOrsy2C6P2pnLWtJ1azN7igfjxLu5UizIHdle4CDvi5WhtGEp_qm7T_aGrfauy-9lp2Q_xErbH1qMYz02tvUu_DkYIFVHbZtNZ7crl7stszD-UCa1E2N0MZW_kKaCI2zC457war-vnw4tWo"
                                            alt="Leather Wallet"
                                        />
                                        <div>
                                            <p className="font-bold text-on-surface">
                                                Leather Wallet
                                            </p>
                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                                FOUND
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Marcus Thorne
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Chicago, IL
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Oct 11, 2023
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end">
                                        <span className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                                            In Progress
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-surface-container-low transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            className="w-12 h-12 rounded-lg object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvDx5Qn5qJpCh2ybdoXl1gg-Lzx30RfO6hTceJ2DmV4xfwiP2oYeR3BFe0gVHNkyrq9DusvdtccXn9ZAiCakLPA8yMzioECrFqFdHpQbY8ne_ek56Oal9barRf1CZHwEDzzj8BCKd4URNH6ivl8J1PKBlr7tMMxTRn8ZkTPJ5e7dT6PUOYzM20e8xf-zM3elnDpLhdeAd4j03B90mDMxZoHXNqivlos_TS-9BsrwX7126To8yXEpWvv_EF6Z7w2iPkuD6CDRoJYA8"
                                            alt="Tabby Cat"
                                        />
                                        <div>
                                            <p className="font-bold text-on-surface">Tabby Cat</p>
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                                LOST
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Elena Rodriguez
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Austin, TX
                                </td>
                                <td className="px-8 py-6 text-sm text-on-surface-variant">
                                    Oct 10, 2023
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end">
                                        <span className="px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                                            Resolved
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}