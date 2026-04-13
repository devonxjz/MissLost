"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";
import CreatePostModal from "@/app/components/CreatePostModal";

/* ─────────── types ─────────── */
interface PostUser {
  full_name: string;
  avatar_url: string | null;
}

interface PostCategory {
  name: string;
  icon_name: string;
}

interface FeedPost {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  status: string;
  view_count: number;
  created_at: string;
  // lost
  location_lost?: string;
  time_lost?: string;
  is_urgent?: boolean;
  reward_note?: string;
  // found
  location_found?: string;
  time_found?: string;
  is_in_storage?: boolean;
  // joined
  users: PostUser;
  item_categories: PostCategory | null;
  // derived
  _type: "lost" | "found";
}

interface PaginatedResponse {
  data: FeedPost[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

/* ─────────── helpers ─────────── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

/* ─────────── component ─────────── */
export default function FeedsPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const LIMIT = 10;

  /* ── fetch posts ── */
  const loadPosts = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        const [lostRes, foundRes] = await Promise.all([
          apiFetch<PaginatedResponse>(
            `/lost-posts?status=approved&limit=${LIMIT}&page=${pageNum}`,
          ),
          apiFetch<PaginatedResponse>(
            `/found-posts?status=approved&limit=${LIMIT}&page=${pageNum}`,
          ),
        ]);

        // Tag each post with its type
        const lostPosts = (lostRes.data ?? []).map((p) => ({ ...p, _type: "lost" as const }));
        const foundPosts = (foundRes.data ?? []).map((p) => ({ ...p, _type: "found" as const }));

        // Merge & sort by created_at desc
        const merged = [...lostPosts, ...foundPosts].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setPosts((prev) => (reset ? merged : [...prev, ...merged]));

        // hasMore if either endpoint has more pages
        const lostHasMore = pageNum < (lostRes.meta?.totalPages ?? 1);
        const foundHasMore = pageNum < (foundRes.meta?.totalPages ?? 1);
        setHasMore(lostHasMore || foundHasMore);
        setPage(pageNum);
      } catch {
        // Silent fail — feed just stops loading more
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [loading],
  );

  /* ── initial load ── */
  useEffect(() => {
    loadPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── infinite scroll via IntersectionObserver ── */
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadPosts(page + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, page]);

  /* ── refresh after posting ── */
  const handlePostSuccess = () => {
    loadPosts(1, true);
  };

  /* ── render ── */
  return (
    <div className="flex-1 flex flex-row gap-6">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 mt-4 mb-8">
        {/* Composer Trigger */}
        <section className="bg-[var(--color-bg-card)] backdrop-blur-2xl xl:backdrop-blur-3xl rounded-lg p-6 shadow-sm border border-[var(--color-border-primary)]">
          <div
            className="flex gap-4 mb-4 cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <img
              alt="Avatar"
              className="w-10 h-10 rounded-full"
              src="https://ui-avatars.com/api/?name=User&background=f1f3f9&color=5f6368"
            />
            <div className="flex-1 bg-[var(--color-bg-input)] rounded-2xl p-4 h-14 flex items-center text-[var(--color-text-secondary)]/50 text-sm hover:bg-[#e8eaf3] transition-colors">
              Bạn đang tìm kiếm gì hoặc nhặt được gì?
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-input-hover)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[#dadde5] transition-all"
              >
                <span className="material-symbols-outlined text-[#3647dc]">
                  image
                </span>
                Ảnh/Video
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-input-hover)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[#dadde5] transition-all"
              >
                <span className="material-symbols-outlined text-[#b41340]">
                  location_on
                </span>
                Vị trí
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold border border-indigo-100"
              >
                <span className="material-symbols-outlined">home_storage</span>
                Điểm lưu giữ
              </button>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-[#3647dc] to-[#8c98ff] text-[#f3f1ff] px-8 py-2.5 rounded-full font-bold shadow-lg shadow-[#3647dc]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Đăng tin
            </button>
          </div>
        </section>

        {/* Feed Grid */}
        {initialLoading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <article
                key={i}
                className="bg-[var(--color-bg-card)] backdrop-blur-2xl rounded-lg overflow-hidden flex flex-col border border-[var(--color-border-primary)] shadow-lg shadow-indigo-500/5"
              >
                <div className="h-64 bg-[var(--color-bg-input-hover)] animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                  <div className="h-4 w-full bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                </div>
              </article>
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-[var(--color-text-muted)] mb-4">
              inbox
            </span>
            <h3 className="text-lg font-bold text-[var(--color-text-muted)] mb-2">
              Chưa có bài đăng nào
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Hãy là người đầu tiên đăng tin tìm đồ hoặc thông báo nhặt được!
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-[#3647dc] to-[#8c98ff] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#3647dc]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Đăng tin ngay
            </button>
          </div>
        ) : (
          /* Post list */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => {
              const isLost = post._type === "lost";
              const loc = isLost ? post.location_lost : post.location_found;
              const mainImage = post.image_urls?.[0];

              return (
                <article
                  key={`${post._type}-${post.id}`}
                  className="bg-[var(--color-bg-card)] backdrop-blur-2xl rounded-lg overflow-hidden flex flex-col group border border-[var(--color-border-primary)] shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-[var(--color-bg-input)]">
                    {mainImage ? (
                      <img
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={mainImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-[var(--color-text-muted)]">
                          {isLost ? "search_off" : "location_on"}
                        </span>
                      </div>
                    )}

                    {/* Type Badge */}
                    <span
                      className={`absolute top-4 left-4 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg ${
                        isLost
                          ? "bg-[#b41340]/90"
                          : "bg-[#4050bc]/90"
                      }`}
                    >
                      {isLost ? "Mất đồ" : "Nhặt được"}
                    </span>

                    {/* Urgent badge */}
                    {isLost && post.is_urgent && (
                      <span className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        🚨 Khẩn cấp
                      </span>
                    )}

                    {/* Image count */}
                    {post.image_urls?.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">photo_library</span>
                        {post.image_urls.length}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight line-clamp-1 flex-1">
                        {post.title}
                      </h3>
                      <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-input-hover)] px-2 py-1 rounded shrink-0 ml-2">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>

                    <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2 flex-1">
                      {post.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] min-w-0">
                        {loc && (
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="material-symbols-outlined text-base shrink-0">
                              location_on
                            </span>
                            <span className="truncate">{loc}</span>
                          </div>
                        )}
                        {post.item_categories && (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="material-symbols-outlined text-base">
                              {post.item_categories.icon_name}
                            </span>
                            <span className="hidden sm:inline">{post.item_categories.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-2 shrink-0">
                        <img
                          alt={post.users?.full_name}
                          className="w-6 h-6 rounded-full object-cover"
                          src={
                            post.users?.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(post.users?.full_name || "U")}&size=24&background=eff0f7&color=5B6CFF`
                          }
                        />
                        <span className="text-xs font-semibold text-[var(--color-text-secondary)] hidden sm:inline">
                          {post.users?.full_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {/* Loading more indicator */}
        {loading && !initialLoading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-[#3647dc] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* End of feed */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">
              — Bạn đã xem hết bài đăng —
            </p>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex flex-col w-80 shrink-0 gap-8 mt-4 mb-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide pb-4">
        {/* Gần bạn (Map Card) */}
        <section className="bg-[var(--color-bg-card)] backdrop-blur-2xl rounded-lg p-6 border border-[var(--color-border-primary)] shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3647dc]">
              near_me
            </span>
            Gần bạn
          </h2>
          <div className="w-full h-48 rounded-2xl overflow-hidden relative mb-4 bg-[var(--color-bg-input)]">
            <img
              alt="Map mockup"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF5kdKrxwdvnl__pXxIIwBn2x5rnfEJsEIB_JFIjbejwuXSkgi8yORn-c6G8oK52XPrP6W8SxgJLuUkJoW0CNAFqdS0fdgrDti32B35By5TotEsmb1dq_KiK_LjcVmJTmjzAc7AHKqD8PPYlCpaqh1YIyqHvKyZf_NYxOCEQ76W_PoPHvnLUiCNIj1L7nHFVmVjuw5yXK38V_D14tp85drHnNMG7CmH0IMh1jRABq6maGEBZhnV8O4R0T7TFADM2YERqXRO9Lh0iI"
            />
            <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span
                className="material-symbols-outlined text-[#3647dc] text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#b41340]" />
              <p className="text-sm text-[var(--color-text-secondary)] flex-1">
                Có 12 món đồ đang thất lạc gần đây
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4050bc]" />
              <p className="text-sm text-[var(--color-text-secondary)] flex-1">
                5 điểm lưu giữ đang hoạt động
              </p>
            </div>
          </div>
        </section>

        {/* Anh hùng nhặt đồ (Leaderboard) */}
        <section className="bg-[var(--color-bg-card)] backdrop-blur-2xl rounded-lg p-6 border border-[var(--color-border-primary)] shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#734a90]">
              workspace_premium
            </span>
            Anh hùng nhặt đồ
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-[var(--color-text-secondary)]/30 w-6">
                1
              </span>
              <img
                alt="Hero 1"
                className="w-10 h-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuArdiArqdLgK9VW_LxTVNoMlTKIXm6lB_LLZrWUKM_wncHBaA1lzAmtWixm7TDFMs-vH2JzhTl5gxLUNoJW8R1sMer2kWAChbSdeLCqiRu0GGcX0Jm9w1qKHPVEc9rY08-9czO8S7M6H0-j5rnWZaoZO4CFYF_aWhZlHFSLJGm1rXVCVGO1oG2kpExZwSEnkalUeRdL53b24yFuvPJLBXFsZydnXvqUTk5lJCLWa-YEPevADod2dzJBmlJx7jgmP6Jy52OmQFksvPw"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm">Minh Anh</h4>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  24 đồ vật đã trả lại
                </p>
              </div>
              <div className="bg-[#dcacfb] text-[#50286c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Top 1
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-[var(--color-text-secondary)]/30 w-6">
                2
              </span>
              <img
                alt="Hero 2"
                className="w-10 h-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-gYxSv0Pt279Sw6SB0LjDjlBxOcc7l_mtzPZbloOxgYEPdPoushF9YeRlAPVusTYlF2t4yfaDLTSXNsuDKZf1jYiGu70bSgghHYrtMb2IkwJk-fbyFOGxLGGGqOqcKYNufIVoHwot-dMMzeLv1X4YNV0hUdykmSJrGzQLEG9llMPgrenqnFkKKBqoiBlFVyPmYOHINLCeR4gZKt38A3OGVQcQIIT-FW0lsFa7pv6CiG9aPhowK-gBtcjKN86jjKjHVpPuggVTsKw"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm">Quốc Trung</h4>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  18 đồ vật đã trả lại
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-[var(--color-text-secondary)]/30 w-6">
                3
              </span>
              <img
                alt="Hero 3"
                className="w-10 h-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt60vc8fdzAtyFhTZbvOvUwmVRTkmkNi4TIacMPi2Pv8fGpMFPYWCKcu7IZVjVmx1F8cpzsGL2nGDPBYVdMHqupxWJFtY4C7WKb_K2dYaUud0-kXSAIndJglTDd_mjugJTb4KSLjgHCKaSubzwNrTX45SMu6l9oabsyitQt0pIEzS2w74IrqnSERSa-9f9wnlocLarNLnKYNMEbGFVKzXWR-QljGqp-Xip-4zOemnQLYHsyRffa6PpVSGQ6585I7tVUxUCdtsgiDQ"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm">Hà Phương</h4>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  15 đồ vật đã trả lại
                </p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] text-sm font-bold rounded-xl hover:bg-[#e6e8ef] transition-all">
            Xem tất cả bảng xếp hạng
          </button>
        </section>
      </aside>

      {/* Create Post Modal */}
      <CreatePostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handlePostSuccess}
      />
    </div>
  );
}
