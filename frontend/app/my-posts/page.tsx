"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";
import Link from "next/link";

interface PostCategory {
  name: string;
  icon_name: string;
}

interface MyPost {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  view_count?: number;
  status: string;
  created_at: string;
  is_urgent?: boolean;
  category_id?: number;
  item_categories: PostCategory | null;
  _type: "lost" | "found";
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

export default function MyPostsPage() {
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const [lostRes, foundRes] = await Promise.all([
        apiFetch<any[]>("/lost-posts/my"),
        apiFetch<any[]>("/found-posts/my"),
      ]);

      const lostData = (lostRes as any).data ?? [];
      const foundData = (foundRes as any).data ?? [];

      const lostPosts = (Array.isArray(lostData) ? lostData : []).map((p) => ({ ...p, _type: "lost" as const }));
      const foundPosts = (Array.isArray(foundData) ? foundData : []).map((p) => ({ ...p, _type: "found" as const }));

      const merged = [...lostPosts, ...foundPosts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setPosts(merged);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Computed data
  const totalViews = posts.reduce((acc, p) => acc + (p.view_count || 0), 0);
  const totalResponses = 0; // Not tracking yet via API
  const totalSuccess = posts.filter((p) => ["resolved", "returned", "closed"].includes(p.status)).length;
  
  const filteredPosts = posts.filter(p => {
    if (filter === "all") return true;
    if (filter === "active") return ["pending", "approved"].includes(p.status);
    if (filter === "resolved") return ["resolved", "returned", "closed"].includes(p.status);
    return true;
  });

  const featuredPost = posts.length > 0 
    ? posts.reduce((prev, current) => ((prev.view_count || 0) > (current.view_count || 0) ? prev : current)) 
    : null;

  return (
    <main className="flex-1 p-8 lg:p-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f33] mb-2">Bài đăng của tôi</h1>
            <p className="text-[#595b61] max-w-md">Quản lý và theo dõi trạng thái các tin đăng tìm đồ thất lạc hoặc nhặt được của bạn.</p>
          </div>
          <div className="flex gap-2 p-1 bg-[#eff0f7] rounded-full">
            <button 
              onClick={() => setFilter("all")} 
              className={`px-6 py-2 rounded-full text-sm transition-all ${filter === "all" ? "bg-white font-bold shadow-sm text-[#3647dc]" : "hover:bg-white/50 font-medium text-[#595b61]"}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilter("active")} 
              className={`px-6 py-2 rounded-full text-sm transition-all ${filter === "active" ? "bg-white font-bold shadow-sm text-[#3647dc]" : "hover:bg-white/50 font-medium text-[#595b61]"}`}
            >
              Đang đăng
            </button>
            <button 
              onClick={() => setFilter("resolved")} 
              className={`px-6 py-2 rounded-full text-sm transition-all ${filter === "resolved" ? "bg-white font-bold shadow-sm text-[#3647dc]" : "hover:bg-white/50 font-medium text-[#595b61]"}`}
            >
              Đã tìm thấy/trả lại
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#3647dc] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">inbox</span>
            <h3 className="text-lg font-bold text-slate-400 mb-2">Bạn chưa có bài đăng nào</h3>
            <p className="text-sm text-slate-300 mb-6">Hãy là người đầu tiên đăng tin tìm đồ hoặc thông báo nhặt được!</p>
            <Link href="/feeds" className="bg-gradient-to-r from-[#3647dc] to-[#8c98ff] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#3647dc]/20 hover:scale-[1.02] active:scale-95 transition-all">
              Bắt đầu đăng tin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => {
              const isLost = post._type === "lost";
              const isResolved = ["resolved", "returned", "closed"].includes(post.status);
              const isPending = post.status === "pending";
              const mainImage = post.image_urls?.[0];

              return (
                <div key={post.id} className={`bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-500 border border-white/20 ${isResolved ? "opacity-90" : ""}`}>
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    {mainImage ? (
                      <img 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isResolved ? "grayscale-[30%]" : ""}`} 
                        alt={post.title} 
                        src={mainImage} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-slate-200">
                          {isLost ? "search_off" : "location_on"}
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      {isLost ? (
                        <span className="bg-[#3647dc] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-lg">Mất đồ</span>
                      ) : (
                        <span className="bg-[#734a90] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-lg">Nhặt được</span>
                      )}
                    </div>
                    
                    <div className="absolute bottom-4 right-4">
                      {isResolved ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                          Đã trả lại
                        </span>
                      ) : isPending ? (
                        <span className="bg-white/90 backdrop-blur-md text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                          Chờ duyệt
                        </span>
                      ) : (
                        <span className={`bg-white/90 backdrop-blur-md ${isLost ? "text-[#3647dc]" : "text-[#734a90]"} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                          <span className={`w-2 h-2 ${isLost ? "bg-[#3647dc]" : "bg-[#734a90]"} rounded-full animate-pulse`}></span>
                          Đang đăng
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col h-[200px]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-[#2c2f33] leading-snug line-clamp-1 flex-1 pr-2">{post.title}</h3>
                      {isResolved ? (
                        <span className="material-symbols-outlined text-[#74777c]">verified</span>
                      ) : (
                        <button className="text-[#74777c] hover:text-[#3647dc] transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      )}
                    </div>
                    
                    <p className="text-sm text-[#595b61] mb-auto line-clamp-2">{post.description || "Không có mô tả"}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#e6e8ef] mt-4">
                      <div className="flex items-center gap-2 text-xs text-[#74777c]">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {timeAgo(post.created_at)}
                      </div>
                      {isResolved ? (
                        <span className="text-[#74777c] text-sm font-medium italic">Đã hoàn tất</span>
                      ) : (
                        <button className="text-[#3647dc] text-sm font-bold hover:underline">Chi tiết</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Featured Wide Card */}
            {featuredPost && filter === "all" && (
              <div className="lg:col-span-2 bg-white/75 backdrop-blur-xl rounded-lg p-8 flex flex-col md:flex-row gap-8 items-center border border-white/20 group hover:shadow-xl transition-all">
                <div className="w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-inner bg-slate-100 flex items-center justify-center">
                  {featuredPost.image_urls?.[0] ? (
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={featuredPost.title} src={featuredPost.image_urls[0]}/>
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-slate-300">image</span>
                  )}
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className="mb-2">
                    <span className="text-[10px] font-black text-[#3647dc] uppercase tracking-widest px-2 py-1 bg-[#3647dc]/5 rounded">Tin nổi bật của bạn</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#2c2f33] mb-4">{featuredPost.title}</h3>
                  <p className="text-[#595b61] mb-6">Bạn đã đăng tin này {timeAgo(featuredPost.created_at).toLowerCase()}. Tin đang nhận được {featuredPost.view_count || 0} lượt xem.</p>
                  <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-[#3647dc] text-white rounded-full font-bold text-sm shadow-md hover:shadow-[#3647dc]/30 active:scale-95 transition-all">Đẩy tin ngay</button>
                    <button className="px-6 py-2.5 bg-[#e0e2ea] text-[#2c2f33] rounded-full font-bold text-sm hover:bg-[#dadde5] transition-all">Xem thống kê</button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Card */}
            {filter === "all" && (
              <div className="bg-white/75 backdrop-blur-xl rounded-lg p-8 flex flex-col justify-between border border-white/20 bg-gradient-to-br from-white/80 to-[#3647dc]/5">
                <div>
                  <h4 className="text-xs font-black text-[#595b61] uppercase tracking-widest mb-4">Thống kê hoạt động</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#595b61]">Lượt xem tin</span>
                      <span className="text-xl font-black text-[#3647dc]">{totalViews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#595b61]">Lượt phản hồi</span>
                      <span className="text-xl font-black text-[#3647dc]">{totalResponses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#595b61]">Thành công</span>
                      <span className="text-xl font-black text-[#3647dc]">{totalSuccess < 10 ? `0${totalSuccess}` : totalSuccess}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/40">
                  <p className="text-[10px] text-[#74777c] italic">Dữ liệu cập nhật realtime theo db</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
