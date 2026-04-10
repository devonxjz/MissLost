export default function MyPostsPage() {
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
            <button className="px-6 py-2 bg-white rounded-full text-sm font-bold shadow-sm text-[#3647dc]">Tất cả</button>
            <button className="px-6 py-2 hover:bg-white/50 rounded-full text-sm font-medium text-[#595b61] transition-all">Đang đăng</button>
            <button className="px-6 py-2 hover:bg-white/50 rounded-full text-sm font-medium text-[#595b61] transition-all">Đã tìm thấy</button>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Active Lost */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-500 border border-white/20">
            <div className="relative h-56 overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Chìa khóa Honda Civic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4_qq9ymHIyWXBuNYfO3mwod8IMbUWHt2Om16VbKwecVymMsihKF_0mpfE4cPzTwGZM1xROVWeNkGC-RHIMFvkZM3z81YLsv3R6JbXqzxViF7R53r0HMlF5ImEvixapwtxfZjnXJvatxbe-dNH4qIrHx0fAVo09Be3nDp3qaFt6wGuimKr8ZxTCNZ2N88_fSYqmkbyxQHkG9bIPVnYY_tCSaDwdKUrOfZNRaAjAAXtT7b-9P4eyauXfC6vkDOpFKYrj6uqhynnBME"/>
              <div className="absolute top-4 left-4">
                <span className="bg-[#3647dc] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-lg">Mất đồ</span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-[#3647dc] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#3647dc] rounded-full animate-pulse"></span>
                  Đang đăng
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-[#2c2f33] leading-snug">Chìa khóa Honda Civic</h3>
                <button className="text-[#74777c] hover:text-[#3647dc] transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <p className="text-sm text-[#595b61] mb-6 line-clamp-2">Làm rơi tại khu vực bãi xe Vincom Đồng Khởi tối ngày 12/10. Có gắn kèm móc khóa hình gấu...</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#e6e8ef]">
                <div className="flex items-center gap-2 text-xs text-[#74777c]">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  2 giờ trước
                </div>
                <button className="text-[#3647dc] text-sm font-bold hover:underline">Chi tiết</button>
              </div>
            </div>
          </div>

          {/* Card 2: Returned */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-500 border border-white/20 opacity-90">
            <div className="relative h-56 overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%]" alt="Đồng hồ Apple" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGgscQdKsH_VCAJpHnO0XMtapcYy_I-2fnTO479Dq23hhoX4aSnO24aMFlUDv4cf4b4z4CFrI-El31kXmKTXCBvEWAc_cOqFSZWzPJeDBN0utrQYr9rExuKYDFTsR32cOD6vhhIBCUpG1grKP-sCO_dl4npQevAK72BrAnpjT5-S5aa-Z6yU8lEWXRRMVZ1sHDJ8jA1fJkCp4zvE-i-FZcSnZ4nTmaY_ohnCKpUbxOD2_0-iGetvJo1Ovqkrs2qlfUBxmKurXcVAA"/>
              <div className="absolute top-4 left-4">
                <span className="bg-[#734a90] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-lg">Nhặt được</span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  Đã trả lại
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-[#595b61] leading-snug">Đồng hồ thông minh Apple</h3>
                <span className="material-symbols-outlined text-[#74777c]">verified</span>
              </div>
              <p className="text-sm text-[#595b61] mb-6 line-clamp-2">Đã trao trả lại cho chủ nhân tại Quận 1. Cảm ơn mọi người đã hỗ trợ chia sẻ tin.</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#e6e8ef]">
                <div className="flex items-center gap-2 text-xs text-[#74777c]">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  3 ngày trước
                </div>
                <span className="text-[#74777c] text-sm font-medium italic">Đã hoàn tất</span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Found */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-500 border border-white/20">
            <div className="relative h-56 overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Ví nam màu đỏ" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsoV9dvff6DqM6gPRe934tWHWfYzpSosSATim3lw3GEN0Yzyye7JcKq5xvqt7bDHxwPI2q2QzT-EqAtPUQRDmqZfeoIbpPnFPDYGhgrSYtGlMUHNE3ajxam0wnC95UW3y7jiJQIrAtcib4zpowVTBjL5H1F_I7G7_vv3DhpkmEaMyrI_Gm6PXz_T9gkwwDl_eq0yRPcr1LKD2QWDtRKSPb4rNyUxFie5mhYGHR19ZwJOd-bT_td3nKQNG4Ts4TIyBUXMDZD8X3ex8"/>
              <div className="absolute top-4 left-4">
                <span className="bg-[#734a90] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-lg">Nhặt được</span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-[#3647dc] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#3647dc] rounded-full animate-pulse"></span>
                  Đang đăng
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-[#2c2f33] leading-snug">Ví nam màu đỏ</h3>
                <button className="text-[#74777c] hover:text-[#3647dc] transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <p className="text-sm text-[#595b61] mb-6 line-clamp-2">Nhặt được tại quán cafe Highland Nguyễn Huệ. Bên trong có thẻ SV mang tên Nguyễn Văn A...</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#e6e8ef]">
                <div className="flex items-center gap-2 text-xs text-[#74777c]">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  5 giờ trước
                </div>
                <button className="text-[#3647dc] text-sm font-bold hover:underline">Chi tiết</button>
              </div>
            </div>
          </div>

          {/* Featured Wide Card */}
          <div className="lg:col-span-2 bg-white/75 backdrop-blur-xl rounded-lg p-8 flex flex-col md:flex-row gap-8 items-center border border-white/20 group hover:shadow-xl transition-all">
            <div className="w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-inner">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="TV Samsung" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpJkCYdX6abLCYSJpUQ9pjZhyZKwZaQ0H4wC18u7YMxXKMcTnEkGmiftUjXFNFK0vKDV16I6No9okAg0lSZcNjEbYpftlsI0-XODL82UL69fRz0Kp3d3IaYj_dHz2ZNORh7Af-pOo7o3nZXVIhjo9sImx8_lD6pvXjNwUXMzwQTg5FGqdoltLYRNVbJm9QtJyRSAWHHvPKZ8zITlqN9besJK3P7TejZHRnkOyl6Qaazw-GsGwHzLtvDa85RzWmP2z4uS8nPWVOG8M"/>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-[10px] font-black text-[#3647dc] uppercase tracking-widest px-2 py-1 bg-[#3647dc]/5 rounded">Tin nổi bật</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#2c2f33] mb-4">TV Samsung 55 inch</h3>
              <p className="text-[#595b61] mb-6">Bạn đã đăng tin này 1 tuần trước. Tin đang nhận được 124 lượt xem và 5 tin nhắn quan tâm. Bạn có muốn đẩy tin lên đầu trang không?</p>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-[#3647dc] text-white rounded-full font-bold text-sm shadow-md hover:shadow-[#3647dc]/30 active:scale-95 transition-all">Đẩy tin ngay</button>
                <button className="px-6 py-2.5 bg-[#e0e2ea] text-[#2c2f33] rounded-full font-bold text-sm hover:bg-[#dadde5] transition-all">Xem thống kê</button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg p-8 flex flex-col justify-between border border-white/20 bg-gradient-to-br from-white/80 to-[#3647dc]/5">
            <div>
              <h4 className="text-xs font-black text-[#595b61] uppercase tracking-widest mb-4">Thống kê bài đăng</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#595b61]">Lượt xem tin</span>
                  <span className="text-xl font-black text-[#3647dc]">1,240</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#595b61]">Lượt phản hồi</span>
                  <span className="text-xl font-black text-[#3647dc]">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#595b61]">Thành công</span>
                  <span className="text-xl font-black text-[#3647dc]">02</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/40">
              <p className="text-[10px] text-[#74777c] italic">Dữ liệu cập nhật 5 phút trước</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
