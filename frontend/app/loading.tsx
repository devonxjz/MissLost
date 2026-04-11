export default function RootLoading() {
  return (
    <div className="flex-1 flex flex-col gap-8 mt-4 mb-8">
      {/* Generic Page Loader Skeleton */}
      <section className="bg-white/75 backdrop-blur-2xl xl:backdrop-blur-3xl rounded-lg p-6 shadow-sm border border-[#abadb3]/15">
        <div className="flex gap-4 mb-4">
          <div className="w-48 h-8 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-8 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="w-24 h-8 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="w-24 h-8 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="bg-white/75 backdrop-blur-2xl rounded-lg overflow-hidden flex flex-col border border-[#abadb3]/10 shadow-lg shadow-indigo-500/5">
            <div className="relative h-64 bg-slate-200 animate-pulse"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-slate-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-2/3 bg-slate-200 rounded mb-4 animate-pulse"></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
