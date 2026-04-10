import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RightSidebar() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updateScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <aside
      className="hidden lg:block w-80 shrink-0 sticky top-24 h-screen p-8 bg-surface-container-low/50 backdrop-blur-md z-40 overflow-y-auto"
    >
      {/* Gần bạn */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-[#2c2f33] tracking-tight">
            Gần bạn
          </h2>
          <span className="text-xs text-[#3647dc] font-bold cursor-pointer hover:underline">
            Xem bản đồ
          </span>
        </div>
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl flex gap-4 hover:scale-[1.02] transition-transform cursor-pointer border border-white/40">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                alt="Item"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwH_Rp2L7vfW3a_sYaD9K-gMH6vIXFUsX9uXkdSzHvwvZeLHKz--g6q-f96kdmWhojKaoObVjbxcXp3T6eUMwTs5pEmqjPpu7aqcGUvIt-zIkA3SgTDQ6xQOml-b2bfD1Ou8xOhubWsnquBK1-yMwGrTqPuhXt3wsu67dan9POqqp1ibpaKqjDPFFjB9lH0ogZ6Ji6w-xTEv05F6OA2PFGqgHC5DYxsx9VGYqgnnEMb_iRA5zFqpViZ3QovyGh0ERuTSzIvi42HNU"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm line-clamp-1">Balo Laptop xanh</h4>
              <p className="text-xs text-[#595b61] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-xs">distance</span> 200m
              </p>
              <span className="text-[10px] bg-[#b41340]/10 text-[#b41340] px-2 py-0.5 rounded-full font-bold mt-2 inline-block">Mất đồ</span>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex gap-4 hover:scale-[1.02] transition-transform cursor-pointer border border-white/40">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                alt="Item"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS30lWoz2Y_myJtT5b0jhG8rwEMtnH_tftkpMAedGL0rN6ObaqaUWHzFKtjLNDIFYSxC90-GfoEZF6H7oIoR_VNrznjLRG_1vBrocTaldOKafWvzBH6FCr65zlME6TCyhTtxIKugdtu_kssjC8LbhDLdTRa0GY2HTKmsuqTt-r4OaW1XHGaEdK7IyAx52mMY9k4ffVi0Lds0YBYvlr75MUm-KmHgUDklIFdm4ZvgXRDwctxKO4Q5XqMZOzmJIa_YLCLIY6SswGGZE"
              />
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

      {/* Anh hùng nhặt đồ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="material-symbols-outlined text-amber-500"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
          <h2 className="text-xl font-extrabold tracking-tight">Anh hùng nhặt đồ</h2>
        </div>
        <div className="space-y-5">
          {[
            {
              name: "Trần Thanh Tùng",
              count: "12 vật phẩm đã trả lại",
              rank: 1,
              badge: "bg-amber-400",
              src:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDoFYFx7QZsOI0OEHEPEhxDvKfZ260ZxHJlFxvJ40FGWRPpuQKP6n0_WDzi8xL1ohIOuWLjInf7jzYbmbQlziA6FAkJ3j6akB2O60YvkpgSIDFTKS25At8pn_P7A7hkcLi9lJ17feEnDZwj71DWcrHQS8dc4DZSs2-V2Rgd86FLCzzOKPRR4C9asMqMdUBmfIG1eIDSTV-79YLLSKrkEfPx79SJnjmmJqId8aPjqUA86bsiN70IZioM85RkTLpAh5luKPPPOChdNGo",
              medal: "🥇",
            },
            {
              name: "Nguyễn Mai Anh",
              count: "9 vật phẩm đã trả lại",
              rank: 2,
              badge: "bg-slate-300",
              src:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCY1O7kBs5MCVIO59GVhk7_jPC8f3VxmIJ78yg1w1iSuWZzVqV-pM0PtVm-qcVI3DqlhbL5GlhMrbvytv_eLrahFko8yy-_kpN4GScj1Blxca1ifBGoXiGnDdKWfdg2ZP5rrWpmpYcUujBNGUQ__jtYDhfLZZTmF9bk3bqyc0qt3JDLJ0DvGFgFZ20ZBFTUY4HpnbT5jdGfTF6p5U9iKfe-NKcsLP-jqi7UR6h7Jqciynqxsz53A1aFyJwpo5-n3_CcEHsFC-8d-Dc",
              medal: "🥈",
            },
            {
              name: "Phạm Thị Lan",
              count: "7 vật phẩm đã trả lại",
              rank: 3,
              badge: "bg-amber-700/60",
              src:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCD1gJ6X39kNd5abNxqTjTpbBi_fVmVWkMKq-nOZQMiS03OcFgYkJqmdAXTThblYbLRad7efMHD0-AdQPzT2mQnSiRCxJLr0BXD28vQeSgl61-iT4LVw3v5dKssehEwqDzpL77UGAFz6QFSIRorOpagYvB8Tsw2GEdgh2BYdzhJy-Rnpl7Po2pc4RW-CBwPEBx2lqN6vWFu-3m14JIRGujAXmEmZFrMfidOVRa7MY0zDExMfniXUyERrvnHbB2U9TN4j7kcM-o2q1Y",
              medal: "🥉",
            },
          ].map((hero) => (
            <div key={hero.rank} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    alt={hero.name}
                    className="w-12 h-12 rounded-full border-2 border-[#3647dc]/20 group-hover:border-[#3647dc] transition-colors"
                    src={hero.src}
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 ${hero.badge} text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#f5f6fc]`}
                  >
                    {hero.medal}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm">{hero.name}</p>
                  <p className="text-xs text-[#595b61]">{hero.count}</p>
                </div>
              </div>
              <span className="text-xs font-black text-[#3647dc]">{hero.rank}</span>
            </div>
          ))}

          <button
            className="w-full mt-8 py-3 border border-outline-variant/30 rounded-full text-xs font-bold text-[#595b61] hover:bg-surface-container-high transition-colors"
          >
            Xem bảng xếp hạng
          </button>
        </div>
      </section>

      {/* Hoạt động mới */}
      <section>
        <h2 className="text-lg font-extrabold text-[#2c2f33] tracking-tight mb-4">
          Hoạt động mới
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#caceff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm text-[#2a3aa7]">celebration</span>
            </div>
            <div>
              <p className="text-xs text-[#2c2f33] leading-tight">
                <span className="font-bold">Linh Chi</span> vừa trao trả <span className="font-bold">Chìa khóa</span> cho chủ nhân.
              </p>
              <p className="text-[10px] text-[#595b61] mt-1">2 phút trước</p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}