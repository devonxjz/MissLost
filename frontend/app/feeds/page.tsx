export default function FeedsPage() {
  return (
    <>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 mt-4 mb-8">
        {/* Composer */}
        <section className="bg-white/75 backdrop-blur-2xl xl:backdrop-blur-3xl rounded-lg p-6 shadow-sm border border-[#abadb3]/15">
          <div className="flex gap-4 mb-4">
            <img
              alt="Avatar"
              className="w-10 h-10 rounded-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADHR-73GonBdH7JiEOeiRe_C0Ic-pjFlgHl4gF14yhQh0UbxrC3e0c8QegYMrqsJEHJWeI2qFCyUq1Zj3JnARf8q29V_hR50vv0tLdCfOj4K32r5FFzsQpJuFYY7CRe0fozRNN1VAfytuul_P38qdOY3VyS3eRDIUaQFahmzkLhDLvsJ88sk2ns197t3CIvZ5by9hudfe7_3n_EJOHEU4VQcyj9RQ9whiNMBDjek5lAgzzhKA_xy3o20VBIV4k8HtaJIi2w9oOjqw"
            />
            <textarea
              className="flex-1 bg-[#eff0f7] outline-none border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#3647dc] resize-none h-24 placeholder:text-[#595b61]/50"
              placeholder="Bạn đang tìm kiếm gì hoặc nhặt được gì?"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0e2ea] text-[#595b61] text-sm font-medium hover:bg-[#dadde5] transition-all">
                <span className="material-symbols-outlined text-[#3647dc]">image</span> Ảnh/Video
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0e2ea] text-[#595b61] text-sm font-medium hover:bg-[#dadde5] transition-all">
                <span className="material-symbols-outlined text-[#b41340]">location_on</span> Vị trí
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold border border-indigo-100">
                <span className="material-symbols-outlined">home_storage</span> Điểm lưu giữ
              </button>
            </div>
            <button className="bg-gradient-to-r from-[#3647dc] to-[#8c98ff] text-[#f3f1ff] px-8 py-2.5 rounded-full font-bold shadow-lg shadow-[#3647dc]/20 hover:scale-[1.02] active:scale-95 transition-all">
              Đăng tin
            </button>
          </div>
        </section>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feed Item 1 (Lost) */}
          <article className="bg-white/75 backdrop-blur-2xl rounded-lg overflow-hidden flex flex-col group border border-[#abadb3]/10 shadow-lg shadow-indigo-500/5">
            <div className="relative h-64 overflow-hidden">
              <img
                alt="Lost Airpods"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Oy3P_6GN8DuDofBIYlREItiy_1YCz-ZEdCWtwgIswpHYm0_OZZgxpFbQDB8h0kYbo-ulxPKse_1pMxir7hIY4pbuwkwXbskFH_mCixiVBWXm7RcS5gmCBkR76Ujw5K9g-avR8sJ_iCg3m9xbP9EdnsYgz_a8Ghu17yFAgRj4Qx2UxMsR1u4EegLeHNeU4XZGSPcuSlVwv-FxuHlvRHk9SfN7tdR2duvLQqk8gKX2O7vki5p0u4X7Z3lBfVvA4pyozbQoA63nYvE"
              />
              <span className="absolute top-4 left-4 bg-[#b41340]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Mất đồ</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-[#2c2f33] leading-tight">Airpods Pro 2nd Gen</h3>
                <span className="text-xs text-[#595b61] bg-[#e0e2ea] px-2 py-1 rounded">2 giờ trước</span>
              </div>
              <p className="text-[#595b61] mb-4 line-clamp-2">Mình có đánh rơi một hộp Airpods tại công viên Cầu Giấy sáng nay. Ai thấy vui lòng liên hệ giúp.</p>
              <div className="flex items-center gap-4 text-sm font-medium text-[#595b61]">
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> Cầu Giấy, HN</div>
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-base">verified</span> Uy tín: 98</div>
              </div>
            </div>
          </article>

          {/* Feed Item 2 (Found) */}
          <article className="bg-white/75 backdrop-blur-2xl rounded-lg overflow-hidden flex flex-col group border border-[#abadb3]/10 shadow-lg shadow-indigo-500/5">
            <div className="relative h-64 overflow-hidden">
              <img
                alt="Found Wallet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtCGZQVbztY-UoEgkTiBAl_nmiorXXmljw_4uf2VzWQFRNYnCoxFZhYTkbPUM6Km-RZKFfSQwveNmGbzoUsoGVLIea-_d4Ol0MN4nCfVHdMceAfdVOFDgzJIaMmCS6smJCb_CEHfCv1ytSDSjSEGFHPrBXHddbUilRAbIRcpY1qRr6k6RqVMWt8rD3KoKOsBDrBuCMlHG1f9AfjsDiouRox6Nh2QvgpGaf8Lqi3MJuo-xx16kEp0CTs0JlEFVNw38hJWfeWNjTnUE"
              />
              <span className="absolute top-4 left-4 bg-[#4050bc]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Nhặt được</span>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-sm">home_storage</span>
                <span className="text-xs font-bold text-indigo-900">Tại: Circle K Trần Duy Hưng</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-[#2c2f33] leading-tight">Ví nam màu nâu</h3>
                <span className="text-xs text-[#595b61] bg-[#e0e2ea] px-2 py-1 rounded">5 giờ trước</span>
              </div>
              <p className="text-[#595b61] mb-4 line-clamp-2">Nhặt được ví tại Circle K. Bên trong có thẻ CCCD tên Nguyễn Văn A và một số giấy tờ khác.</p>
              <div className="flex items-center gap-4 text-sm font-medium text-[#595b61]">
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> Thanh Xuân, HN</div>
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-base">workspace_premium</span> Hero</div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex flex-col w-80 shrink-0 gap-8 mt-4 mb-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide pb-4">
        {/* Gần bạn (Map Card) */}
        <section className="bg-white/75 backdrop-blur-2xl rounded-lg p-6 border border-[#abadb3]/15 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3647dc]">near_me</span> Gần bạn
          </h2>
          <div className="w-full h-48 rounded-2xl overflow-hidden relative mb-4">
            <img
              alt="Map mockup"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF5kdKrxwdvnl__pXxIIwBn2x5rnfEJsEIB_JFIjbejwuXSkgi8yORn-c6G8oK52XPrP6W8SxgJLuUkJoW0CNAFqdS0fdgrDti32B35By5TotEsmb1dq_KiK_LjcVmJTmjzAc7AHKqD8PPYlCpaqh1YIyqHvKyZf_NYxOCEQ76W_PoPHvnLUiCNIj1L7nHFVmVjuw5yXK38V_D14tp85drHnNMG7CmH0IMh1jRABq6maGEBZhnV8O4R0T7TFADM2YERqXRO9Lh0iI"
            />
            <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-[#3647dc] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#b41340]"></div>
              <p className="text-sm text-[#595b61] flex-1">Có 12 món đồ đang thất lạc gần đây</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4050bc]"></div>
              <p className="text-sm text-[#595b61] flex-1">5 điểm lưu giữ đang hoạt động</p>
            </div>
          </div>
        </section>

        {/* Anh hùng nhặt đồ (Leaderboard) */}
        <section className="bg-white/75 backdrop-blur-2xl rounded-lg p-6 border border-[#abadb3]/15 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#734a90]">workspace_premium</span> Anh hùng nhặt đồ
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-[#595b61]/30 w-6">1</span>
              <img alt="Hero 1" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArdiArqdLgK9VW_LxTVNoMlTKIXm6lB_LLZrWUKM_wncHBaA1lzAmtWixm7TDFMs-vH2JzhTl5gxLUNoJW8R1sMer2kWAChbSdeLCqiRu0GGcX0Jm9w1qKHPVEc9rY08-9czO8S7M6H0-j5rnWZaoZO4CFYF_aWhZlHFSLJGm1rXVCVGO1oG2kpExZwSEnkalUeRdL53b24yFuvPJLBXFsZydnXvqUTk5lJCLWa-YEPevADod2dzJBmlJx7jgmP6Jy52OmQFksvPw" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">Minh Anh</h4>
                <p className="text-xs text-[#595b61]">24 đồ vật đã trả lại</p>
              </div>
              <div className="bg-[#dcacfb] text-[#50286c] text-[10px] font-bold px-2 py-0.5 rounded-full">Top 1</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-[#595b61]/30 w-6">2</span>
              <img alt="Hero 2" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-gYxSv0Pt279Sw6SB0LjDjlBxOcc7l_mtzPZbloOxgYEPdPoushF9YeRlAPVusTYlF2t4yfaDLTSXNsuDKZf1jYiGu70bSgghHYrtMb2IkwJk-fbyFOGxLGGGqOqcKYNufIVoHwot-dMMzeLv1X4YNV0hUdykmSJrGzQLEG9llMPgrenqnFkKKBqoiBlFVyPmYOHINLCeR4gZKt38A3OGVQcQIIT-FW0lsFa7pv6CiG9aPhowK-gBtcjKN86jjKjHVpPuggVTsKw" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">Quốc Trung</h4>
                <p className="text-xs text-[#595b61]">18 đồ vật đã trả lại</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-[#595b61]/30 w-6">3</span>
              <img alt="Hero 3" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt60vc8fdzAtyFhTZbvOvUwmVRTkmkNi4TIacMPi2Pv8fGpMFPYWCKcu7IZVjVmx1F8cpzsGL2nGDPBYVdMHqupxWJFtY4C7WKb_K2dYaUud0-kXSAIndJglTDd_mjugJTb4KSLjgHCKaSubzwNrTX45SMu6l9oabsyitQt0pIEzS2w74IrqnSERSa-9f9wnlocLarNLnKYNMEbGFVKzXWR-QljGqp-Xip-4zOemnQLYHsyRffa6PpVSGQ6585I7tVUxUCdtsgiDQ" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">Hà Phương</h4>
                <p className="text-xs text-[#595b61]">15 đồ vật đã trả lại</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 border border-[#abadb3]/30 text-[#595b61] text-sm font-bold rounded-xl hover:bg-[#e6e8ef] transition-all">Xem tất cả bảng xếp hạng</button>
        </section>
      </aside>
    </>
  );
}
