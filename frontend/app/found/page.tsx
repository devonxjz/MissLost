export default function FoundPage() {
  return (
    <>
      {/* Main Content */}
      <main className="flex-1 min-h-screen px-6 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-[#2c2f33] tracking-tight mb-2">Đồ nhặt được</h1>
              <p className="text-[#595b61] font-medium">Tìm thấy <span className="text-[#3647dc] font-bold">124</span> vật phẩm đang chờ chủ nhân.</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-[#e0e2ea] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#dadde5] transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span> Lọc
              </button>
            </div>
          </div>
        </header>

        {/* Found Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Large Featured Card */}
          <div className="xl:col-span-2 group relative overflow-hidden rounded-lg bg-white/75 backdrop-blur-xl border border-white/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-video w-full relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Ví da nam màu đen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7WRQ58nc74_nGoXUs-thpBy0NkKspX3KvwmLcv9r7NRDZEkwqmGJoI3GASDZG4pAK0uCZMuSJTDY5qhpSg6lx99QmtARq8B6151nsX3YSuDklPxgwjWhBlS2YcDu_8NbAPmccTY6bOcso4xy173bS_ODvGaA5EDgx718svEdmb1QhXOTWLrSAIoBFckjcn3i5xzdvz_3WJzrIjKsAQO8mF0QTBZc_OMjUDIFdNSfeIi-w8ABA24wBXinYduw8TGPiEJSnyJ97uQk"/>
              <div className="absolute top-4 left-4 bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Nhặt được</div>
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">3 giờ trước</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f33] mb-1">Ví da nam màu đen</h3>
                  <p className="text-sm text-[#595b61] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#3647dc]">location_on</span>
                    Sảnh chính Vincom Đồng Khởi, Q.1
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[#4ade80] font-bold">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                  <span className="text-xs uppercase tracking-tighter">Uy tín cao</span>
                </div>
              </div>
              <p className="text-[#595b61] text-sm line-clamp-2 mb-6">Nhặt được tại khu vực thang cuốn. Bên trong có thẻ căn cước và thẻ ngân hàng tên NGUYEN VAN A. Vui lòng liên hệ để xác nhận.</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#e6e8ef]">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img className="w-full h-full object-cover" alt="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxsRb5UEnV_IlPjdym0swGOVqJDp8hqKeruUWMuadcoLImx4XO3ve79jsNoyW-rmdRj-0Anl36u6z4wMCsumPylhKsgC10VBtTV3qXJGFLWM73qahrHe5MMty0qaQJVrJUSf4xYBeLMX3m5Xd0OsFPTMeFkMqL_VNSO9thUsUDsyNTfCoVkrm2rSe9RZz86dY2pUQqJYvkrZI-FNhYcQn0iF4s6i3Y7zgBNyyYpwVK6x0PSfwevEjHmi8zmrdNsbDPgqCLGZLewXg"/>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#8c98ff] flex items-center justify-center text-[10px] text-[#f3f1ff] font-bold">+12</div>
                </div>
                <button className="bg-[#3647dc] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#3647dc]/20 hover:shadow-[#3647dc]/40 transition-all">Nhận đồ</button>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="group overflow-hidden rounded-lg bg-white/75 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-square w-full relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Tai nghe Sony" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLAvtMOa8Vfj2JQUXD0UaKV9XJCB9OtmgYFRaWPjxRsZqdZqf0YraGDVEY4UkCPRRB2w-9OIqj9oK7UifZbZWHhR3YcUOum15UwOIMSVECXgsoIVNO-3qoOakAk1iNQacWVgNh1r_bQCwbb3GKE6OFpvl0JLt7sJpqwzTrPCRv0aHyocsxjoAlEEAXsnpOjpQGdscpMJd6zJDV90hAhOiG4GFU_-l4kSIUda5OOYOqZsZiUzPlLYvFhUSbpVluvt5tEAKFiNlWJYo"/>
              <div className="absolute top-4 left-4 bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">Nhặt được</div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-[#2c2f33] mb-1">Tai nghe Sony WH-1000XM4</h3>
              <p className="text-xs text-[#595b61] flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-xs text-[#3647dc]">location_on</span>
                Công viên Tao Đàn, Q.3
              </p>
              <button className="w-full bg-[#e0e2ea] py-3 rounded-xl text-sm font-bold text-[#595b61] hover:bg-[#3647dc] hover:text-white transition-all">Chi tiết</button>
            </div>
          </div>

          {/* Item 3 */}
          <div className="group overflow-hidden rounded-lg bg-white/75 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-square w-full relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Chùm chìa khóa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeIC5pkhakSsPZf4NpkrAc-5M6Atd550edBCnQ8-0LVkHitUZy-tfVk-d72gR2z62ez69_bDK01UrJr863X7bLvN8g6ARcArhEp2esOKqfnEfZcTCLaEUDE-SjfYagBd_xp8xE3ouBS8Z71_G9mI6adoD3gYvqIaR2xGfYvkj-4dVDRduAPl0dBgHKWtXDQsZ8aggDLgIQoCr0JIZLsSjVwOC6knbt55DOm5EVpVczE1myCmjjHsMsIGlMqS1UTDmk4KBmNKDqOR0"/>
              <div className="absolute top-4 left-4 bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">Nhặt được</div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-[#2c2f33] mb-1">Chùm chìa khóa (5 chìa)</h3>
              <p className="text-xs text-[#595b61] flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-xs text-[#3647dc]">location_on</span>
                Trạm chờ Bus Hàm Nghi
              </p>
              <button className="w-full bg-[#e0e2ea] py-3 rounded-xl text-sm font-bold text-[#595b61] hover:bg-[#3647dc] hover:text-white transition-all">Chi tiết</button>
            </div>
          </div>

          {/* Item 4 */}
          <div className="group overflow-hidden rounded-lg bg-white/75 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-square w-full relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Giày Sneaker Nike" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYpHGcDr4n4_U4_9gNoB_elFez7BvZlQCQapmdlYwApyc3BitWZQqGPibz6vC3rLAik682xDhtytbsnq1Qw1LQ7BAaBuffc8z2-1g3IxVrnVgZlFHy5Xc22Y-61nCbCh693SxuYEW55iK7cfUdCFf4iqyvGqqJlwvw4G6OVb0L_VnIS0YGYsCXcH95XpYS3NmOjHN-TPuIDK7X7Xi8PkXGSQqNoTmGPgHano-ErHvZRx4DHGquC8aFn2lExUEdvTOUhJ_mP9SdSyY"/>
              <div className="absolute top-4 left-4 bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">Nhặt được</div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-[#2c2f33] mb-1">Giày Sneaker Nike Đỏ</h3>
              <p className="text-xs text-[#595b61] flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-xs text-[#3647dc]">location_on</span>
                Sân bóng đá Kỳ Hòa
              </p>
              <button className="w-full bg-[#e0e2ea] py-3 rounded-xl text-sm font-bold text-[#595b61] hover:bg-[#3647dc] hover:text-white transition-all">Chi tiết</button>
            </div>
          </div>

          {/* Item 5 */}
          <div className="group overflow-hidden rounded-lg bg-white/75 backdrop-blur-xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-square w-full relative overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="iPhone 13 Pro Max" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIwS2C-YWyW1bzjJS6TKdiBEAIjzu2UUN4ZyEXCQvBHbhsFq-g0O4a08UBq3opPKpS5DRt2Fh5jOC3pJt6H9jA-cuyZECc-WpwZQDwZ1myCBzQ5odktKfTHls1JNchs64_zplDSI6b6o1CZPBVc2hZYFUhZRpcSaoiU2gwLEGIpK3CpexDeyU_7y4B3Lx02N6PWYId2Nc-uGFfBKjcLR11H3hSO3xHIxJDeaCccdyfyHU8ub9Ld6H9wIrzHqpB7nAv8Gh8Dpf2BYY"/>
              <div className="absolute top-4 left-4 bg-[#4ade80] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">Nhặt được</div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-[#2c2f33] mb-1">iPhone 13 Pro Max (Vàng)</h3>
              <p className="text-xs text-[#595b61] flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-xs text-[#3647dc]">location_on</span>
                Cầu Thủ Thiêm 2
              </p>
              <button className="w-full bg-[#3647dc] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#3647dc]/20 transition-all">Nhận đồ</button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-24 space-y-8 pb-10">
          {/* Gần bạn */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-[#2c2f33] tracking-tight">Gần bạn</h2>
              <span className="text-xs text-[#3647dc] font-bold cursor-pointer hover:underline">Xem bản đồ</span>
            </div>
            <div className="bg-white/75 backdrop-blur-xl rounded-lg p-4 shadow-sm border border-white/20">
              <div className="h-32 rounded-xl mb-4 overflow-hidden">
                <img className="w-full h-full object-cover grayscale opacity-80 brightness-110" alt="Bản đồ TP.HCM" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5C0pwDYhY3A5-NVRnuGol9hTZkAfxE3Kdndn65Lj3apNIGZtXk3joizFE6cAgwURzVXfoITxNOVB5HRL-Qkuu2F0qBNy2S9fP1i7BgeiRryWsQEEzaoN7XUmZL2wt0IOwoEaqZBpFSt_gz5Ox1hkZKrJo04FWHN6rTCwr2xEh3g04lL43gYniWjQDkahYuytEC4UVEVzjExFTriTGV7G_xCytbGiwvmd0QR5npyROve0KGFv0fTVb1zGZWpS4IMRe073mJbXzO9c"/>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#b41340] animate-pulse"></div>
                  <p className="text-xs font-medium text-[#595b61]">Phát hiện ví rơi - 500m</p>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80]"></div>
                  <p className="text-xs font-medium text-[#595b61]">Vừa nhặt được kính - 1.2km</p>
                </div>
              </div>
            </div>
          </section>

          {/* Anh hùng nhặt đồ */}
          <section>
            <h2 className="text-lg font-extrabold text-[#2c2f33] tracking-tight mb-4">Anh hùng nhặt đồ</h2>
            <div className="bg-white/75 backdrop-blur-xl rounded-lg p-5 shadow-sm border border-white/20 space-y-4">
              {[
                {name: "Minh Triết", items: "24 vật phẩm", rank: "#1", medal: "🥇", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMNbXfje78EeUF5CQSMupz5QtCbYO6aluInr_m4y8eHUKf1Vnkq1Klsq6v48N5txc4qJOkiGmSbfVwTKDK8LlJzqORSAyOoXgnnX66-VXc4zpwjT5KVLXbreLJRoAucFee9Nd0_CH-WJMPPKFKU0D4D1cZ9XQPrWY5Xsoo2CaUCcVFnx2MxwWgznJ3tn3iLOwRD2Uimt_oOr29dG0RzSuUU40jq7oP9FxCHLIENWwt_Uf1ja1i-JhUV6uhKfIcw2EHixYmdguKFDY"},
                {name: "Linh Chi", items: "18 vật phẩm", rank: "#2", medal: "🥈", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1WhAsvFMGG8Ul_6DhM9bpXxfY9fv1HZkcjzd_hbnz39XGa27xv8OqeR8rh5v7QHw3REkaRjpPEXbEoroAcUGsfWYK2uC2GH5RxTscjbZOpu-Pca3WlLJCXmzmO4wzTMXqx7rErDs7eynLoEC5NaN2xT3R6aquZfBakbRrdkJWbyrwNRLoMPq2nzknSnpWcFotcus_RsNMkdD7DFt-ucULzGujQdf1azB4E_GvZ3RH3ZP9VPKVTBsP0aFtOzoXoFF72UT9-F8P-I"},
                {name: "Quốc Bảo", items: "12 vật phẩm", rank: "#3", medal: "🥉", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCJ2qGmD2PqlOGIn4pt1-_mqcKuCOR82ShtJGHUG4frYZzzv4o6e8awsW0GxRHWVAK8mwKqY-B7MRPDxJFCnrs0zr_Tigf5-WJbiFVpH0I9fmtRYAVwKwdBMS0LHDQZs7uzoIppaKtHmWUfcQnVbyq4QPcsy_aFW655128dYhggSm7Ose8N36V0OlLmUXbX-ogXCPW2mYFuKLuFuRlPw8diTogceuZ28CW21rGlL31s4bihe71pswwTMAo2SASx2zzcBpJFWojeaE"},
              ].map((h) => (
                <div key={h.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8c98ff]">
                        <img className="w-full h-full object-cover" alt={h.name} src={h.src}/>
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-xs">{h.medal}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2c2f33]">{h.name}</p>
                      <p className="text-[10px] text-[#595b61]">{h.items}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#3647dc]">{h.rank}</span>
                </div>
              ))}
              <button className="w-full mt-2 py-3 rounded-xl bg-[#f5f6fc] text-xs font-bold text-[#3647dc] hover:bg-[#8c98ff] hover:text-[#000d79] transition-all">Bảng xếp hạng tuần</button>
            </div>
          </section>

          {/* Hoạt động mới */}
          <section>
            <h2 className="text-lg font-extrabold text-[#2c2f33] tracking-tight mb-4">Hoạt động mới</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#caceff] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm text-[#2a3aa7]">celebration</span>
                </div>
                <div>
                  <p className="text-xs text-[#2c2f33] leading-tight"><span className="font-bold">Linh Chi</span> vừa trao trả <span className="font-bold">Chìa khóa</span> cho chủ nhân.</p>
                  <p className="text-[10px] text-[#595b61] mt-1">2 phút trước</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
