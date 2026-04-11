export default function FeedsLoading() {
  return (
    <>
      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex flex-col gap-8 mt-4 mb-8">
        {/* Composer Skeleton */}
        <section className="bg-white/75 backdrop-blur-2xl xl:backdrop-blur-3xl rounded-lg p-6 shadow-sm border border-[#abadb3]/15">
          <div className="flex gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="flex-1 bg-[#eff0f7] rounded-2xl h-24 animate-pulse"></div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <div className="w-24 h-9 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="w-24 h-9 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="w-28 h-9 rounded-full bg-indigo-50 animate-pulse"></div>
            </div>
            <div className="w-28 h-10 rounded-full bg-indigo-200 animate-pulse"></div>
          </div>
        </section>

        {/* Feed Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feed Item Skeletons */}
          {[1, 2].map((i) => (
            <article key={i} className="bg-white/75 backdrop-blur-2xl rounded-lg overflow-hidden flex flex-col border border-[#abadb3]/10 shadow-lg shadow-indigo-500/5">
              <div className="relative h-64 bg-slate-200 animate-pulse"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-slate-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded mb-4 animate-pulse"></div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Right Sidebar Skeleton */}
      <aside className="hidden xl:flex flex-col w-80 shrink-0 gap-8 mt-4 mb-8">
        <section className="bg-white/75 backdrop-blur-2xl rounded-lg p-6 border border-[#abadb3]/15 shadow-sm">
          <div className="h-6 w-32 bg-slate-200 rounded mb-4 animate-pulse"></div>
          <div className="w-full h-48 rounded-2xl bg-slate-200 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </section>

        <section className="bg-white/75 backdrop-blur-2xl rounded-lg p-6 border border-[#abadb3]/15 shadow-sm">
          <div className="h-6 w-40 bg-slate-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </>
  );
}
