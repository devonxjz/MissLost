export default function RootLoading() {
  return (
    <div className="flex-1 flex flex-col gap-8 mt-4 mb-8">
      {/* Generic Page Loader Skeleton */}
      <section className="bg-[var(--color-bg-card)] backdrop-blur-2xl xl:backdrop-blur-3xl rounded-lg p-6 shadow-sm border border-[var(--color-border-primary)]">
        <div className="flex gap-4 mb-4">
          <div className="w-48 h-8 bg-[var(--color-bg-input-hover)] rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-8 bg-[var(--color-bg-input-hover)] rounded-full animate-pulse"></div>
          <div className="w-24 h-8 bg-[var(--color-bg-input-hover)] rounded-full animate-pulse"></div>
          <div className="w-24 h-8 bg-[var(--color-bg-input-hover)] rounded-full animate-pulse"></div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="bg-[var(--color-bg-card)] backdrop-blur-2xl rounded-lg overflow-hidden flex flex-col border border-[var(--color-border-primary)] shadow-lg shadow-indigo-500/5">
            <div className="relative h-64 bg-[var(--color-bg-input-hover)] animate-pulse"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 w-3/4 bg-[var(--color-bg-input-hover)] rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-[var(--color-bg-input-hover)] rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-2/3 bg-[var(--color-bg-input-hover)] rounded mb-4 animate-pulse"></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
