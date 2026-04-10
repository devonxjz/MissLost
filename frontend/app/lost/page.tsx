export default function LostPage() {
  return (
    <>
      <main className="flex-1 p-8">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#2c2f33] mb-2">Đồ Thất Lạc</h1>
          <p className="text-[#595b61] font-medium text-lg">Hỗ trợ cộng đồng tìm lại những vật dụng quan trọng.</p>
        </header>

        {/* Filter Chips */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button className="px-6 py-2 bg-[#3647dc] text-[#f3f1ff] rounded-full font-bold text-sm whitespace-nowrap">Tất cả</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[#595b61] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Ví & Giấy tờ</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[#595b61] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Điện thoại</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[#595b61] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Chìa khóa</button>
          <button className="px-6 py-2 bg-[#dadde5] text-[#595b61] rounded-full font-bold text-sm hover:bg-[#caceff] transition-colors whitespace-nowrap">Thú cưng</button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/20">
            <div className="relative h-64 overflow-hidden">
              <img alt="Ví Da Màu Nâu" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWQ82aI3Q5N3zKqJ4OyEyTFswIA5_DR7RtwBQVuNzdDN1CNBCPGtroCoym5B2CiuBLoUdqbrIywEdGio0MDi1OV3_jgNnrtg5xoqJS1vMY-b2PpoYEC8ToNwzwVR4CYjKmt8kwARoT_Etv7wVZrZtzlmNJSEaQ4epCqSCm0wMG4vszldOL8SA08LnIp-6_ecWJvlSNJ8Fz5Lefi4e4rMGApCRQcD3C_xqJuHkNlIzQ6QG4-YoH0LTGtdsW9mAdA4jILD-Ej_swtbo"/>
              <div className="absolute top-4 left-4 bg-[#b41340] text-[#ffefef] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Mất đồ
              </div>
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">2 giờ trước</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f33] mb-1">Ví Da Màu Nâu</h3>
                  <div className="flex items-center gap-2 text-[#595b61] text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Quận 1, TP. Hồ Chí Minh</span>
                  </div>
                </div>
                <span className="text-[#b41340] font-extrabold text-lg">2.000.000đ</span>
              </div>
              <p className="text-[#595b61] text-sm leading-relaxed mb-6 line-clamp-2">
                Mất ví tại khu vực đường Nguyễn Huệ. Bên trong có CCCD mang tên Nguyễn Văn A, thẻ ngân hàng và một ít tiền mặt...
              </p>
              <div className="flex items-center justify-between border-t border-slate-200/30 pt-6">
                <div className="flex items-center gap-3">
                  <img alt="Minh Quân" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB44xUd9KEycm-MFka1hw597m92CDiwDKY4KVXnvPXvABl1bjcWMKafw3diZFK5P5YWN8YUT0lXzzceQJDbbBbVlMPeUa9_YQiUNlfrHvXffbPKmAcK50P_grkbWhrKCXnWDLActz5URx-QFFtvDtO24PTWJgYjI4TtnvYcdTPgSIuVoPWRIOvgLB69odQPJI-RSTb-Q7TqjsOz_-OtMZUKIbPNYZrvFXK4DLiO4ssmkcehUfQT9OfDEh3y0KKv2Bddv8k9lPkNkPU"/>
                  <span className="text-sm font-bold">Minh Quân</span>
                </div>
                <button className="bg-[#dadde5] hover:bg-[#8c98ff] hover:text-[#000d79] text-[#595b61] px-5 py-2 rounded-full text-xs font-bold transition-all">
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/20">
            <div className="relative h-64 overflow-hidden">
              <img alt="Cún Golden Lạc" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9ohgKnKpaqrW8HWN__zfPCOG2Ek6J4UCpk0kWNCtaro8YHUmCOTdfxmK78ia_HNcNzdrl7uHZOojU5u_mcdKqaG504mN79pjFD5_uPoT5vPBFeYSdsg2jtd4kslO_KQ1gWne7c1OXL4ucQ1V-meIad4-SsZ77DzFOPYe3EyDiNHLC3kkmXrckijenAS7bSK706jZbhcDjQb-RvyA-XUBXTzDpek2mofcEw8Yx39qgvHxEJb7SNgq4Gv1b2nV2LNdQSfnLtHs4Dtg"/>
              <div className="absolute top-4 left-4 bg-[#b41340] text-[#ffefef] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Mất đồ
              </div>
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">5 giờ trước</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f33] mb-1">Cún Golden Lạc</h3>
                  <div className="flex items-center gap-2 text-[#595b61] text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Quận 7, TP. Hồ Chí Minh</span>
                  </div>
                </div>
                <span className="text-[#b41340] font-extrabold text-lg">Hậu tạ cao</span>
              </div>
              <p className="text-[#595b61] text-sm leading-relaxed mb-6 line-clamp-2">
                Bé tên Lu, đi lạc từ sáng nay tại khu dân cư Him Lam. Bé rất hiền và có đeo vòng cổ màu đỏ...
              </p>
              <div className="flex items-center justify-between border-t border-slate-200/30 pt-6">
                <div className="flex items-center gap-3">
                  <img alt="Thùy Chi" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfNJ51ekFuXGp2Kq-vAh0AYp2-sZ9VzSfVR8UkhmnN343oSNjMs48N0midGkqJJ-J3bRkNctY7XMQYTJTi60VxamSbQxAzkWr63LKDnSPz_iXDOanwRYfAiQGCXWNDJviaIvYgURiDKSPZlnwatirr2f9hFYGJ8FsDfvjN8bCWttqV138u0nYgqusvJz-nwd77G-t5XT7ZKw7SUu4oPTZn4zoUSTJHls4sEDmq0YjRXQ7ztqOBK32kSw8VZt5lbaiIVB0279BKQ4Q"/>
                  <span className="text-sm font-bold">Thùy Chi</span>
                </div>
                <button className="bg-[#dadde5] hover:bg-[#8c98ff] hover:text-[#000d79] text-[#595b61] px-5 py-2 rounded-full text-xs font-bold transition-all">
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/20">
            <div className="relative h-64 overflow-hidden">
              <img alt="iPhone 14 Pro Max" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJG4tXh6WG6N8TgFSlW354RrZwRGsVO1WKQu6iF7_aeFX7KRj3O-fmPGxWxE0DH4MTbiulVZHxEmnS0laG6r3OYdaEvr0FZ4Vzk6K6GX911bS0Scz1HLO9_mI4zY6-tS9tTcIYF-xheT8zctOnqPDO9-PeOUUePvJ9GAcxJeD2NfSj9NnRFR1QrIdwz4sS4-HdUIHO8-RvjQwuv5_QWI03OE72WobySZmQrUrWkdT4d2cIwX4tB3uU83-ZV5_I85CQ9nrtyx8Rrh0"/>
              <div className="absolute top-4 left-4 bg-[#b41340] text-[#ffefef] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Mất đồ
              </div>
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium">12 giờ trước</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f33] mb-1">iPhone 14 Pro Max</h3>
                  <div className="flex items-center gap-2 text-[#595b61] text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Hoàn Kiếm, Hà Nội</span>
                  </div>
                </div>
                <span className="text-[#b41340] font-extrabold text-lg">3.000.000đ</span>
              </div>
              <p className="text-[#595b61] text-sm leading-relaxed mb-6 line-clamp-2">
                Bỏ quên máy tại quán cafe Highland khu vực Bờ Hồ. Máy màu tím, có ốp lưng trong suốt...
              </p>
              <div className="flex items-center justify-between border-t border-slate-200/30 pt-6">
                <div className="flex items-center gap-3">
                  <img alt="Hoàng Nam" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTtCMauHV_CGUFGJIwVR_Vun6XXGl5llC5bKZGkAKsTy464Ibj_k64ylHHW0NC3gPEDkVSx-VKBC3rkRZilxZfDWtJR5Q6h3p_a2QYW1h_1V8P2PxSUU1sM5xwm-vTPO98Ji8pzjr2De2MyFvN_rAyM-JJXyIP0Ww-l7kT5fF79AHWzvEnFn9YSLov8-ENr8zmp57eiA5_Gqikh03J91NdBRMBNI0FGqFhTPc4qj-93J1gtsuoSy6fDngxB9uxOt6OeaQUxaYLvtE"/>
                  <span className="text-sm font-bold">Hoàng Nam</span>
                </div>
                <button className="bg-[#dadde5] hover:bg-[#8c98ff] hover:text-[#000d79] text-[#595b61] px-5 py-2 rounded-full text-xs font-bold transition-all">
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/75 backdrop-blur-xl rounded-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/20">
            <div className="relative h-64 overflow-hidden">
              <img alt="Chùm chìa khóa ô tô" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJDHXX-C3FgZOVuThNS38DMqyYm9TfOb0FjkUMJvoQOxmJqW-c-CIYa2mxRCdRYc1n4xCd1ldbeReoiH5pflnGr46Cg1RcsHzCegIlnXh8KWmxk0WJEh3K_zK-Ty37dv-e7WyAius7-sKHYrh9XcQak3ZohF9M7oyHx_u6GNAHDnY3bJlH-AQhQlr5UudyKShv_l8D41_I7B5Iewr88_vm7Y_O52tJ4IEt56CFXNzF0KooO2FD8vWd5rXl2lM4fkOwP4VcAoEUurE"/>
              <div className="absolute top-4 left-4 bg-[#b41340] text-[#ffefef] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Mất đồ
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2c2f33] mb-1">Chùm chìa khóa ô tô</h3>
                  <div className="flex items-center gap-2 text-[#595b61] text-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>Cầu Giấy, Hà Nội</span>
                  </div>
                </div>
                <span className="text-[#b41340] font-extrabold text-lg">Thỏa thuận</span>
              </div>
              <p className="text-[#595b61] text-sm leading-relaxed mb-6 line-clamp-2">
                Đánh rơi chùm chìa khóa xe Mazda có kèm móc khóa hình gấu dâu. Khu vực công viên Nghĩa Đô...
              </p>
              <div className="flex items-center justify-between border-t border-slate-200/30 pt-6">
                <div className="flex items-center gap-3">
                  <img alt="Lê Hồng" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3JgomPVcXD58j5yAYSC9WIMIRbGlwBWsLdWFIcceE3V1691tIIC4udCgP3t5ItqR04kCFsNP6VKw4Wk8CRYZy1O2YFw_0Hm5fXnK8f0Ra6kwt8ivjvFkR31bM1mIS6zdx0A_xkCIJIZEr86cpIuYAjcI17xW12tVUIzhEBWV1cu6f97-pgXm2Rt4V_Qw1ujx3gCy1XVqBWA2yYL5ZtJdgbqL48ZJ9Ld6EUoj2_OLBd-p34FMi2BZjmsSspTzbOTQpu8sBC_0cu5U"/>
                  <span className="text-sm font-bold">Lê Hồng</span>
                </div>
                <button className="bg-[#3647dc] text-[#f3f1ff] px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md">
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </div>
        </div>
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
              <div className="bg-white/75 backdrop-blur-xl p-4 rounded-xl flex gap-4 hover:scale-[1.02] transition-transform cursor-pointer border border-white/40">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img alt="Balo Laptop xanh" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwH_Rp2L7vfW3a_sYaD9K-gMH6vIXFUsX9uXkdSzHvwvZeLHKz--g6q-f96kdmWhojKaoObVjbxcXp3T6eUMwTs5pEmqjPpu7aqcGUvIt-zIkA3SgTDQ6xQOml-b2bfD1Ou8xOhubWsnquBK1-yMwGrTqPuhXt3wsu67dan9POqqp1ibpaKqjDPFFjB9lH0ogZ6Ji6w-xTEv05F6OA2PFGqgHC5DYxsx9VGYqgnnEMb_iRA5zFqpViZ3QovyGh0ERuTSzIvi42HNU"/>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm line-clamp-1">Balo Laptop xanh</h4>
                  <p className="text-xs text-[#595b61] flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs">distance</span> 200m
                  </p>
                  <span className="text-[10px] bg-[#b41340]/10 text-[#b41340] px-2 py-0.5 rounded-full font-bold mt-2 inline-block">Mất đồ</span>
                </div>
              </div>
              <div className="bg-white/75 backdrop-blur-xl p-4 rounded-xl flex gap-4 hover:scale-[1.02] transition-transform cursor-pointer border border-white/40">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img alt="Kính cận gọng đen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS30lWoz2Y_myJtT5b0jhG8rwEMtnH_tftkpMAedGL0rN6ObaqaUWHzFKtjLNDIFYSxC90-GfoEZF6H7oIoR_VNrznjLRG_1vBrocTaldOKafWvzBH6FCr65zlME6TCyhTtxIKugdtu_kssjC8LbhDLdTRa0GY2HTKmsuqTt-r4OaW1XHGaEdK7IyAx52mMY9k4ffVi0Lds0YBYvlr75MUm-KmHgUDklIFdm4ZvgXRDwctxKO4Q5XqMZOzmJIa_YLCLIY6SswGGZE"/>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm line-clamp-1">Kính cận gọng đen</h4>
                  <p className="text-xs text-[#595b61] flex items-center gap-1 mt-1">
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
                    <p className="text-xs text-[#595b61]">{hero.count}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 border border-slate-300/30 rounded-full text-xs font-bold text-[#595b61] hover:bg-[#e0e2ea] transition-colors">
              Xem bảng xếp hạng
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}
