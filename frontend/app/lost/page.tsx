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

interface FeedPost {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  status: string;
  view_count: number;
  created_at: string;
  location_lost?: string;
  time_lost?: string;
  is_urgent?: boolean;
  reward_note?: string;
  users: PostUser;
  item_categories: PostCategory | null;
  _type: "lost";
}

interface PaginatedResponse {
  data: FeedPost[];
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

export default function LostPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const LIMIT = 10;

  const handleStartChat = async (opponentId: string, lostPostId: string) => {
    try {
      const res = await apiFetch<any>('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({
          recipient_id: opponentId,
          lost_post_id: lostPostId
        })
      });
      const convId = res?.data?.id || res?.id;
      if (convId) {
        router.push(`/messages?conv=${convId}`);
      }
    } catch (e) {
      console.error(e);
      alert("Không thể bắt đầu trò chuyện. Vui lòng đăng nhập.");
    }
  };

  const loadPosts = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await apiFetch<PaginatedResponse>(
          `/lost-posts?status=approved&limit=${LIMIT}&page=${pageNum}`,
        );

        const newPosts = (res.data ?? []).map((p) => ({ ...p, _type: "lost" as const }));

        setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
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

  return (
    <>
      <main className="flex-1 p-8">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tighter text-[var(--color-text-primary)] mb-2">Đồ Thất Lạc</h1>
          <p className="text-[var(--color-text-secondary)] font-medium text-lg">Hỗ trợ cộng đồng tìm lại những vật dụng quan trọng.</p>
        </header>

        {/* Filter Chips */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button className="px-6 py-2 bg-[#3647dc] text-[#f3f1ff] rounded-full font-bold text-sm whitespace-nowrap">Tất cả</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[var(--color-text-secondary)] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Ví & Giấy tờ</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[var(--color-text-secondary)] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Điện thoại</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[var(--color-text-secondary)] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Chìa khóa</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[var(--color-text-secondary)] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Thú cưng</button>
        </div>

        {/* Bento Grid */}
        {initialLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[var(--color-bg-card)] backdrop-blur-xl rounded-lg overflow-hidden border border-white/20">
                <div className="h-64 bg-[var(--color-bg-input-hover)] animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-1/2">
                      <div className="h-6 w-full bg-[var(--color-bg-input-hover)] rounded animate-pulse mb-2" />
                      <div className="h-4 w-3/4 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-1/4 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-[var(--color-bg-input-hover)] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-[var(--color-text-muted)] mb-4">inbox</span>
            <h3 className="text-lg font-bold text-[var(--color-text-muted)] mb-2">Chưa có đồ thất lạc nào</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Hiện tại cộng đồng chưa ghi nhận thêm thông tin nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {posts.map((post) => {
              const loc = post.location_lost;
              const mainImage = post.image_urls?.[0];
              const reward = post.reward_note || "Thỏa thuận";

              return (
                <div key={post.id} className="bg-[var(--color-bg-card)] backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/20">
                  <div className="relative h-64 overflow-hidden bg-[var(--color-bg-input)]">
                    {mainImage ? (
                      <img 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={mainImage}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-input-hover)]">
                        <span className="material-symbols-outlined text-5xl text-[var(--color-text-muted)]">search_off</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-[#b41340] text-[#ffefef] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 bg-[var(--color-bg-card-solid)] rounded-full animate-pulse"></span>
                      Mất đồ
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">
                      {timeAgo(post.created_at)}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1 line-clamp-1">{post.title}</h3>
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          <span className="line-clamp-1">{loc || "Chưa xác định"}</span>
                        </div>
                      </div>
                      <span className="text-[#b41340] font-extrabold text-lg shrink-0">{reward}</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-200/30 pt-6">
                      <div className="flex items-center gap-3">
                        <img 
                          alt={post.users?.full_name || "User"} 
                          className="w-8 h-8 rounded-full object-cover" 
                          src={
                            post.users?.avatar_url || 
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(post.users?.full_name || "U")}&size=32&background=eff0f7&color=5B6CFF`
                          }
                        />
                        <span className="text-sm font-bold truncate max-w-[120px]">{post.users?.full_name || "Người dùng"}</span>
                      </div>
                      <button 
                        onClick={() => handleStartChat(post.users?.id as unknown as string, post.id)}
                        className="bg-[#3647dc] text-[#f3f1ff] px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md hover:scale-[1.02] flex justify-center items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        Nhắn tin ngay
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
        
        {loading && !initialLoading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-[#3647dc] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-80 shrink-0">
        <div className="sticky top-24 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold tracking-tight">Gần bạn</h2>
              <span className="material-symbols-outlined text-[#3647dc] cursor-pointer">my_location</span>
            </div>
            <div className="space-y-4">
              <div className="bg-[var(--color-bg-card)] backdrop-blur-xl p-4 rounded-xl flex gap-4 hover:scale-[1.02] transition-transform cursor-pointer border border-white/40">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img alt="Balo Laptop xanh" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwH_Rp2L7vfW3a_sYaD9K-gMH6vIXFUsX9uXkdSzHvwvZeLHKz--g6q-f96kdmWhojKaoObVjbxcXp3T6eUMwTs5pEmqjPpu7aqcGUvIt-zIkA3SgTDQ6xQOml-b2bfD1Ou8xOhubWsnquBK1-yMwGrTqPuhXt3wsu67dan9POqqp1ibpaKqjDPFFjB9lH0ogZ6Ji6w-xTEv05F6OA2PFGqgHC5DYxsx9VGYqgnnEMb_iRA5zFqpViZ3QovyGh0ERuTSzIvi42HNU"/>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm line-clamp-1">Balo Laptop xanh</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs">distance</span> 200m
                  </p>
                  <span className="text-[10px] bg-[#b41340]/10 text-[#b41340] px-2 py-0.5 rounded-full font-bold mt-2 inline-block">Mất đồ</span>
                </div>
              </div>
              <div className="bg-[var(--color-bg-card)] backdrop-blur-xl p-4 rounded-xl flex gap-4 hover:scale-[1.02] transition-transform cursor-pointer border border-white/40">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img alt="Kính cận gọng đen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS30lWoz2Y_myJtT5b0jhG8rwEMtnH_tftkpMAedGL0rN6ObaqaUWHzFKtjLNDIFYSxC90-GfoEZF6H7oIoR_VNrznjLRG_1vBrocTaldOKafWvzBH6FCr65zlME6TCyhTtxIKugdtu_kssjC8LbhDLdTRa0GY2HTKmsuqTt-r4OaW1XHGaEdK7IyAx52mMY9k4ffVi0Lds0YBYvlr75MUm-KmHgUDklIFdm4ZvgXRDwctxKO4Q5XqMZOzmJIa_YLCLIY6SswGGZE"/>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm line-clamp-1">Kính cận gọng đen</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs">distance</span> 850m
                  </p>
                  <span className="text-[10px] bg-[#b41340]/10 text-[#b41340] px-2 py-0.5 rounded-full font-bold mt-2 inline-block">Mất đồ</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-amber-500" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
              <h2 className="text-xl font-extrabold tracking-tight">Anh hùng nhặt đồ</h2>
            </div>
            <div className="space-y-5">
              {[
                {name: "Trần Thanh Tùng", count: "12 vật phẩm đã trả lại", rank: 1, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoFYFx7QZsOI0OEHEPEhxDvKfZ260ZxHJlFxvJ40FGWRPpuQKP6n0_WDzi8xL1ohIOuWLjInf7jzYbmbQlziA6FAkJ3j6akB2O60YvkpgSIDFTKS25At8pn_P7A7hkcLi9lJ17feEnDZwj71DWcrHQS8dc4DZSs2-V2Rgd86FLCzzOKPRR4C9asMqMdUBmfIG1eIDSTV-79YLLSKrkEfPx79SJnjmmJqId8aPjqUA86bsiN70IZioM85RkTLpAh5luKPPPOChdNGo", badge: "bg-amber-400"},
                {name: "Nguyễn Mai Anh", count: "9 vật phẩm đã trả lại", rank: 2, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCY1O7kBs5MCVIO59GVhk7_jPC8f3VxmIJ78yg1w1iSuWZzVqV-pM0PtVm-qcVI3DqlhbL5GlhMrbvytv_eLrahFko8yy-_kpN4GScj1Blxca1ifBGoXiGnDdKWfdg2ZP5rrWpmpYcUujBNGUQ__jtYDhfLZZTmF9bk3bqyc0qt3JDLJ0DvGFgFZ20ZBFTUY4HpnbT5jdGfTF6p5U9iKfe-NKcsLP-jqi7UR6h7Jqciynqxsz53A1aFyJwpo5-n3_CcEHsFC-8d-Dc", badge: "bg-slate-300"},
                {name: "Phạm Thị Lan", count: "7 vật phẩm đã trả lại", rank: 3, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD1gJ6X39kNd5abNxqTjTpbBi_fVmVWkMKq-nOZQMiS03OcFgYkJqmdAXTThblYbLRad7efMHD0-AdQPzT2mQnSiRCxJLr0BXD28vQeSgl61-iT4LVw3v5dKssehEwqDzpL77UGAFz6QFSIRorOpagYvB8Tsw2GEdgh2BYdzhJy-Rnpl7Po2pc4RW-CBwPEBx2lqN6vWFu-3m14JIRGujAXmEmZFrMfidOVRa7MY0zDExMfniXUyERrvnHbB2U9TN4j7kcM-o2q1Y", badge: "bg-amber-700/60"},
              ].map((hero) => (
                <div key={hero.rank} className="flex items-center gap-4 group">
                  <div className="relative">
                    <img alt={hero.name} className="w-12 h-12 rounded-full border-2 border-[#3647dc]/20 group-hover:border-[#3647dc] transition-colors" src={hero.src}/>
                    <div className={`absolute -bottom-1 -right-1 ${hero.badge} text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#f5f6fc]`}>{hero.rank}</div>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{hero.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{hero.count}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 border border-slate-300/30 rounded-full text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-input-hover)] transition-colors">
              Xem bảng xếp hạng
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}
