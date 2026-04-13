"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

interface PostUser {
  full_name: string;
  avatar_url: string | null;
}

interface PostCategory {
  name: string;
  icon_name: string;
}

interface FoundPost {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  status: string;
  view_count: number;
  created_at: string;
  location_found?: string;
  time_found?: string;
  is_in_storage?: boolean;
  users: PostUser;
  item_categories: PostCategory | null;
}

interface PaginatedResponse {
  data: FoundPost[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

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

export default function FoundPage() {
  const [posts, setPosts] = useState<FoundPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const LIMIT = 12;

  const handleStartChat = async (opponentId: string, foundPostId: string) => {
    try {
      // API backend tạo (hoặc lấy ID) chat. Body có thể thay đổi tùy router DTO
      const res = await apiFetch<any>('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({
          recipient_id: opponentId,
          found_post_id: foundPostId
        })
      });
      // Lấy ID conversation trả về
      const convId = res?.data?.id || res?.id;
      if (convId) {
        router.push(`/messages?conv=${convId}`);
      }
    } catch (e) {
      console.error(e);
      alert("Không thẻ bắt đầu trò chuyện. Vui lòng đăng nhập.");
    }
  };

  const loadPosts = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await apiFetch<PaginatedResponse>(
          `/found-posts?status=approved&limit=${LIMIT}&page=${pageNum}`,
        );

        const newPosts = res.data ?? [];

        setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
        setTotalCount(res.meta?.total ?? 0);
        setHasMore(pageNum < (res.meta?.totalPages ?? 1));
        setPage(pageNum);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [loading],
  );

  useEffect(() => {
    loadPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /* Featured post = first post */
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="flex-1 flex flex-row gap-6">
      {/* Main Content */}
      <main className="flex-1 min-h-screen px-6 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Đồ nhặt được</h1>
              <p className="text-[var(--color-text-secondary)] font-medium">
                {initialLoading ? (
                  <span className="inline-block h-5 w-48 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                ) : (
                  <>Tìm thấy <span className="text-[#3647dc] font-bold">{totalCount}</span> vật phẩm đang chờ chủ nhân.</>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="bg-[var(--color-bg-input-hover)] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#dadde5] transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span> Lọc
              </button>
            </div>
          </div>
        </header>

        {/* Loading Skeletons */}
        {initialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Featured skeleton */}
            <div className="xl:col-span-2 rounded-lg bg-[var(--color-bg-card)] backdrop-blur-xl border border-white/20 shadow-sm overflow-hidden">
              <div className="aspect-video w-full bg-[var(--color-bg-input-hover)] animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 w-2/3 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                <div className="h-4 w-full bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
              </div>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg bg-[var(--color-bg-card)] backdrop-blur-xl border border-white/20 shadow-sm overflow-hidden">
                <div className="aspect-square w-full bg-[var(--color-bg-input-hover)] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                  <div className="h-10 w-full bg-[var(--color-bg-input-hover)] rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-7xl text-[var(--color-text-muted)] mb-6">inventory_2</span>
            <h3 className="text-xl font-bold text-[var(--color-text-muted)] mb-2">Chưa có đồ nhặt được nào</h3>
            <p className="text-sm text-[var(--color-text-muted)] max-w-md">Hiện tại cộng đồng chưa ghi nhận thêm thông tin nào. Hãy là người đầu tiên đăng tin thông báo nhặt được!</p>
          </div>
        ) : (
          /* Found Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Large Featured Card */}
            {featuredPost && (
              <div className="xl:col-span-2 group relative overflow-hidden rounded-lg bg-[var(--color-bg-card)] backdrop-blur-xl border border-white/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-video w-full relative overflow-hidden bg-[var(--color-bg-input)]">
                  {featuredPost.image_urls?.[0] ? (
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={featuredPost.title}
                      src={featuredPost.image_urls[0]}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-input-hover)]">
                      <span className="material-symbols-outlined text-6xl text-[var(--color-text-muted)]">location_on</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Nhặt được</div>
                  <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">{timeAgo(featuredPost.created_at)}</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{featuredPost.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#3647dc]">location_on</span>
                        {featuredPost.location_found || "Chưa xác định"}
                      </p>
                    </div>
                    {featuredPost.is_in_storage && (
                      <div className="flex items-center gap-1 text-[#4ade80] font-bold">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                        <span className="text-xs uppercase tracking-tighter">Đang lưu giữ</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2 mb-6">{featuredPost.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#e6e8ef]">
                    <div className="flex items-center gap-3">
                      <img
                        alt={featuredPost.users?.full_name || "User"}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                        src={
                          featuredPost.users?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredPost.users?.full_name || "U")}&size=32&background=eff0f7&color=5B6CFF`
                        }
                      />
                      <span className="text-sm font-bold text-[var(--color-text-primary)] truncate max-w-[120px]">{featuredPost.users?.full_name || "Người dùng"}</span>
                    </div>
                    <button 
                      onClick={() => handleStartChat(featuredPost.users?.id as unknown as string, featuredPost.id)}
                      className="bg-[#3647dc] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#3647dc]/20 hover:shadow-[#3647dc]/40 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Nhắn tin
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Cards */}
            {gridPosts.map((post) => {
              const mainImage = post.image_urls?.[0];
              return (
                <div key={post.id} className="group overflow-hidden rounded-lg bg-[var(--color-bg-card)] backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square w-full relative overflow-hidden bg-[var(--color-bg-input)]">
                    {mainImage ? (
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={post.title}
                        src={mainImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-input-hover)]">
                        <span className="material-symbols-outlined text-5xl text-[var(--color-text-muted)]">location_on</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">Nhặt được</div>

                    {/* Image count badge */}
                    {post.image_urls?.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">photo_library</span>
                        {post.image_urls.length}
                      </div>
                    )}

                    {/* In-storage badge */}
                    {post.is_in_storage && (
                      <div className="absolute top-4 right-4 bg-[var(--color-bg-card-solid)]/90 backdrop-blur-md text-[#3647dc] text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">home_storage</span>
                        Lưu giữ
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-xs text-[#3647dc]">location_on</span>
                      {post.location_found || "Chưa xác định"}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-4">{post.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <img
                          alt={post.users?.full_name || "User"}
                          className="w-6 h-6 rounded-full object-cover"
                          src={
                            post.users?.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(post.users?.full_name || "U")}&size=24&background=eff0f7&color=5B6CFF`
                          }
                        />
                        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] truncate max-w-[100px]">{post.users?.full_name || "Người dùng"}</span>
                      </div>
                      <span className="text-[10px] text-[var(--color-text-secondary)] bg-[var(--color-bg-input-hover)] px-2 py-0.5 rounded">{timeAgo(post.created_at)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button className="w-full bg-[var(--color-bg-input-hover)] py-3 rounded-xl text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[#caceff] transition-all">
                         Chi tiết
                       </button>
                       <button 
                         onClick={() => handleStartChat(post.users?.id as unknown as string, post.id)}
                         className="w-full bg-[#3647dc] text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#3647dc]/40 transition-all flex items-center justify-center gap-2"
                       >
                         <span className="material-symbols-outlined text-[18px]">chat</span>
                         Nhắn tin
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} className="h-4 mt-8" />

        {/* Loading more */}
        {loading && !initialLoading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-[#3647dc] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* End of feed */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">— Bạn đã xem hết bài đăng —</p>
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-24 space-y-8 pb-10">
          {/* Gần bạn */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-[var(--color-text-primary)] tracking-tight">Gần bạn</h2>
              <span className="text-xs text-[#3647dc] font-bold cursor-pointer hover:underline">Xem bản đồ</span>
            </div>
            <div className="bg-[var(--color-bg-card)] backdrop-blur-xl rounded-lg p-4 shadow-sm border border-white/20">
              <div className="h-32 rounded-xl mb-4 overflow-hidden bg-[var(--color-bg-input)] flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-3xl text-[#3647dc]/40" style={{fontVariationSettings: "'FILL' 1"}}>map</span>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Bản đồ</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {totalCount > 0 ? `${totalCount} vật phẩm đang chờ nhận` : "Chưa có dữ liệu gần đây"}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#3647dc]"></div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)]">Xem bán kính 5km quanh bạn</p>
                </div>
              </div>
            </div>
          </section>

          {/* Hoạt động mới */}
          <section>
            <h2 className="text-lg font-extrabold text-[var(--color-text-primary)] tracking-tight mb-4">Hoạt động mới</h2>
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.slice(0, 3).map((post) => (
                  <div key={`activity-${post.id}`} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#caceff] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm text-[#2a3aa7]">
                        {post.is_in_storage ? "home_storage" : "celebration"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-primary)] leading-tight">
                        <span className="font-bold">{post.users?.full_name || "Người dùng"}</span> vừa đăng tin nhặt được <span className="font-bold">{post.title}</span>.
                      </p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">{timeAgo(post.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-text-muted)] italic">Chưa có hoạt động.</p>
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
