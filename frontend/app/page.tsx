export default function FeedPage() {
  return (
    <>
      {/* Main Feed */}
      <main className="flex-1 max-w-2xl mx-auto w-full pb-20">
        {/* Post Composer */}
        <section className="bg-white/70 backdrop-blur-xl rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex gap-4 mb-4">
            <img 
              className="w-12 h-12 rounded-full object-cover" 
              alt="User avatar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcAtr46pbClZo5vgAPJTitmwNOH6ycPwB9qYIWkGCd1EcG0N1EuP3_gQ5SNEk5l5hzW32Orke7bWpEQ1ZcBssL1KmI_qZzrYYYxMP5zHjYPwagktvYi4aVc09CvNtEd_bt59Ib0OZRGVHJS4Q9n_pZqO3MAM0wetGoc3h3aU7BxmW7G_LEkI1IeSp-AYUgc2r9App8_7qk5SWx1knpQYz3lUaF0aVQ6HJUrhkNMZ_d4vyuniIpiX2jrOaqH5juhEIx5QYOFFEJwqI"
            />
            <textarea 
              className="flex-1 bg-[#e0e2ea]/50 border-none rounded-2xl p-4 focus:ring-[#3647dc]/20 text-[#2c2f33] placeholder:text-slate-400 resize-none h-24" 
              placeholder="Bạn đã mất gì?"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 bg-[#eff0f7] px-4 py-2 rounded-full text-slate-600">
              <span className="material-symbols-outlined text-xl">location_on</span>
              <input className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full outline-none" placeholder="Địa điểm..." type="text" />
            </div>
            <div className="flex items-center gap-2 bg-[#eff0f7] px-4 py-2 rounded-full text-slate-600">
              <span className="material-symbols-outlined text-xl">schedule</span>
              <input className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full outline-none" placeholder="Thời gian..." type="text" />
            </div>
            <div className="flex items-center gap-2 bg-[#eff0f7] px-4 py-2 rounded-full text-slate-600 md:col-span-2">
              <span className="material-symbols-outlined text-xl">warehouse</span>
              <select className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full appearance-none outline-none">
                <option value="">Chọn điểm lưu giữ (nếu có)</option>
                <option>Phòng bảo vệ A1</option>
                <option>Quầy lễ tân Tòa nhà Lotte</option>
                <option>Trung tâm hỗ trợ sinh viên</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-6 py-2.5 rounded-full font-bold text-[#b41340] bg-[#f74b6d]/10 hover:bg-[#f74b6d]/20 transition-all">Đăng mất đồ</button>
            <button className="px-6 py-2.5 rounded-full font-bold text-[#f3f1ff] bg-[#3647dc] shadow-lg shadow-[#3647dc]/20 active:scale-95 transition-all">Đăng nhặt được</button>
          </div>
        </section>

        {/* Feed Content */}
        <div className="space-y-8">
          {/* Post 1 (Lost) */}
          <article className="bg-white/70 backdrop-blur-xl rounded-lg overflow-hidden shadow-sm group">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  className="w-10 h-10 rounded-full" 
                  alt="Portrait of a young woman" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwP41UWKrkcOuOFWlTy6FadcU1dFBYwnXW0zWYpvKitc-1GFiTGvs4dnY12ak4ZpKmb3HgPv_b13hU9SC77LoDgXyxrDrHUvUaxqoWD0SYR0Cwp4LutJGtrodPgWNbDDrmYKUOM-g0GNvTJp9w182lXMisV2wjuqUnFT0gjoQ5M1Z4P8VHjvJCf_KQOpLSLpHXEApivHvkHqcXIkpm5xPVTIO6rUU2HVlpa7qbfFzIJM6on6kYqBJgr3Uo3CCo1uvPMVI_dkmMf4g"
                />
                <div>
                  <h4 className="font-bold text-sm">Nguyễn Thu Hà</h4>
                  <p className="text-xs text-slate-400">2 giờ trước</p>
                </div>
              </div>
              <span className="bg-[#b41340]/10 text-[#b41340] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Mất đồ</span>
            </div>
            <div className="aspect-video w-full relative">
              <img 
                className="w-full h-full object-cover" 
                alt="Brown leather wallet" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEqXAU1oh3y5nflpeYwCYRGBx98ImUW2_vLAIl5n9KBE0wbtVhgCbChuh-TccfSftzgl_iW9OhqKap56yuCDZZtDuAeTqH2u4aQR700Sh_3BFmJuP4DjM10a1D34fg0pQjwHTpPyeZBhZSKxVCqMVysUZf8K2NMrEgJRZAgCVYig1deL_wFNQHxZkJTJp9SJlyNgrso69iWCZO89PDBC1micYaMz_3FhwfESjJvmi0ODTsqOMknr1QHuFzksiCE0B2HhqHgea6O4k"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Ví da màu nâu - Có giấy tờ tên Hà</h3>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  <span>Công viên Thống Nhất</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">event</span>
                  <span>08:30 - 24/10/2023</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-[#e6e8ef] text-[#595b61] font-bold py-3 rounded-xl hover:bg-[#dadde5] transition-colors">Tôi thấy giống</button>
                <button className="flex-1 bg-[#3647dc] text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all">Liên hệ</button>
              </div>
            </div>
          </article>

          {/* Post 2 (Found) */}
          <article className="bg-white/70 backdrop-blur-xl rounded-lg overflow-hidden shadow-sm group">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  className="w-10 h-10 rounded-full" 
                  alt="Portrait of a middle-aged man" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcDW47QUY3jAE7AURGCcx2f7vgiBIwkT3qMoR1j23CQTPUkMQWX4CcF8BTcbLNpi7B6nEwsoB8qACJi7wnWnc17ueKB5omemc6zMSuDjatcPczv1BTo0FXWzwGcmknTciCI3QBlFRi0aKr72bOQPA7MF_SP4QzQSfjJgp-YrOUdCdCSiO5UNcWa2TScY7p_PhBpUriP22B_Y9uhUllGcbQh3vTl7JIcorUBcvC0CqtV9MR3tV7z-TExWjHVnXhMIjXkz4UtiACQbc"
                />
                <div>
                  <h4 className="font-bold text-sm">Trần Minh Quân</h4>
                  <p className="text-xs text-slate-400">5 giờ trước</p>
                </div>
              </div>
              <span className="bg-[#4050bc]/10 text-[#4050bc] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Nhặt được</span>
            </div>
            <div className="aspect-video w-full relative">
              <img 
                className="w-full h-full object-cover" 
                alt="Smartphone on a cafe table" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnLiHvNDrfJ4_IAg93KDiTG7lGT9uIdrfA24en-p_X8sX6LaTvLaglhzUV68YA_ADk7WbAP8qonA1H6fCDBDZtIy_JuQMrBHe6PxyxNhFhhdTEINArgoyXNGoRDxswei27C2iBWEJiEJplfyz9zPjFPdu_dztNBuKf_BVarYL6IKPHZLaKs_3l-gBkiXk04IVJMAY_TiYZPd66VSguln0eAaeEEvNYq_GJduxUvCN5EbMAEbph7IfOgP56Tv4hcOeuRRPm0SJwp-c"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">iPhone 13 Pro Max màu Xanh</h3>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  <span>Starbucks Landmark 81</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">warehouse</span>
                  <span>Gửi tại quầy lễ tân</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-[#e6e8ef] text-[#595b61] font-bold py-3 rounded-xl hover:bg-[#dadde5] transition-colors">Tôi thấy giống</button>
                <button className="flex-1 bg-[#3647dc] text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all">Liên hệ</button>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block w-80 shrink-0">
        <div className="sticky top-24 flex flex-col gap-6">
          <section className="bg-white/70 backdrop-blur-xl rounded-lg p-6 shadow-sm border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3647dc]">location_on</span>
                Gần bạn
              </h3>
              <span className="text-[#3647dc] text-xs font-bold cursor-pointer hover:underline">Tất cả</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start group cursor-pointer">
                <img alt="Lost watch" className="w-14 h-14 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDheb-xfZrsqEZ3_M-dTOWRpcs_kfJJ1JOryewLPh5T-1SZee3jCLiCqynmTjrkk6kH38wdh4pQnceKELMyPZWNZq2YzjwTsLSxQMN9PdB9G5mjM1BGomqZL491lRLNwxdtf9xUaBtq_RXvYBtjnk-wr7F_MelHlX-gLTy61jHj2ByGfauntUPG3i2U46oJgl79Jpf0AKRKtIl_YgGA0TTVtlkjZXSsUauEsQZrk8kjHI9w6dL_FXbOo2VsWMrmG7-Yy_nWm8nolS4"/>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-bold truncate group-hover:text-[#3647dc] transition-colors">Đồng hồ Casio bạc</h5>
                  <p className="text-[10px] text-slate-400 mt-1">Cách 500m • 10 phút trước</p>
                </div>
              </div>
              <div className="flex gap-3 items-start group cursor-pointer">
                <img alt="Lost charger" className="w-14 h-14 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvKloa1mened_oWACjnuTAVv62TmLkGN-WEh9qRCrY3-NlqEIRau-lJSNTZh7VXoyEAkJuUsJWkEEpQ4WfQo7Yiq9a5OPAPQCRE0mSAq7tB2biXvaryBJ0vQHQ5yXHmz0Mgzd6BRkaeLMneTRgstbo4x1wOv2Wl6KE3Tao56a9sRLG1v61alkEXglywrALDDvEdzfOBR09ml2EixVdQ_ZU6JhFoKEML5Fviy2SXhuKpJ3r_xujX0OZFjOc-F3QrDn-MSXgLXgMpJg"/>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-bold truncate group-hover:text-[#3647dc] transition-colors">Sạc laptop Dell</h5>
                  <p className="text-[10px] text-slate-400 mt-1">Cách 1.2km • 25 phút trước</p>
                </div>
              </div>
              <div className="flex gap-3 items-start group cursor-pointer">
                <img alt="Found keys" className="w-14 h-14 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHERgXVuwYSjwnVKV7ahncCxRLcJYFlZCvotPgwnx73K_g6f8MttYrjq_sbfspUCWE3eYs2lfqWHActWL7lVr98dI44R_PHRQr36DWAV63IxfSgU3wY2v9PFXqdJEp7ciqgLQJGAIBOT1ktuMCFrFhPQcKmEEOf_VjlhdAxskXQjjMzBi2fLpov9Tim_lFSyT9VnAYVwTDxdNbuk6IDAxhX3tJQcw7lKJJo3jdF5V2U3hCsQaKF5OF2EUisNlUI8aiHk0Bz0OUDyc"/>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-bold truncate group-hover:text-[#3647dc] transition-colors">Chùm chìa khóa</h5>
                  <p className="text-[10px] text-slate-400 mt-1">Cách 800m • 1 giờ trước</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-white/70 backdrop-blur-xl rounded-lg p-6 shadow-sm border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>trophy</span> Anh hùng nhặt đồ
              </h3>
              <span className="text-[#3647dc] text-xs font-bold cursor-pointer hover:underline">Tất cả</span>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img className="w-12 h-12 rounded-full border-2 border-yellow-400" alt="User ranking 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA3DrKo_zH8eWDsjm0lGw4ddBLSmqFQUPzYdubHi3Db3Ubys62-6XmSuBOgaZ-fGCRXNN00EmNbMEciJdx3fXQSTIAwF7zLaIDAAdaJuEpnbrSkDLcsXnYmucBcVjkOruWZvzqyP_7A4JVHqLheGnInHkjwlDsufu3NQchqFbSWiiJbql3tR2mR-VRqaJY_qmKAPGXB78saOYrN-d9_hiQ-sxPTO88fOcUe2hVlZz9n_syHwwV6W1aiGLZUJ-ocDFvzbQbZlVByJw"/>
                  <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full">1</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold">Lê Văn Nam</h5>
                  <p className="text-[10px] text-slate-400">12 món đã trả lại</p>
                </div>
                <div className="text-right">
                  <span className="text-[#4050bc] font-bold text-sm">2,450</span>
                  <p className="text-[8px] text-slate-400 uppercase">điểm</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img className="w-12 h-12 rounded-full border-2 border-slate-300" alt="User ranking 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvhet7SPQgLEBfIne_DG8ykdeA3YRFHqq0vqmzVcyfm9Kdwf82c6pSALLjzgu8qBhGFCGV_8KtUAbvuQ_UR7IkonHR0iNWq5KlhEg2SLzfO2F_XFovjf8hrf66Pr7VvLjyue6OXkgxk1RYiQ8RHWj0lzeyQ386ama-t1ESDnJsA654fNuhOcyMi1IZjqoNl5gKNHQF2YRXKKyA0aadDqi_Y-4aWHptb6XRUAM_Q--8PDZ0WkNHsG9zvM70aYJJltpI2Wp7tstBXy4"/>
                  <span className="absolute -bottom-1 -right-1 bg-slate-300 text-[#2c2f33] text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full">2</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold">Phạm Minh Anh</h5>
                  <p className="text-[10px] text-slate-400">8 món đã trả lại</p>
                </div>
                <div className="text-right">
                  <span className="text-[#4050bc] font-bold text-sm">1,890</span>
                  <p className="text-[8px] text-slate-400 uppercase">điểm</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-[#3647dc]/5 rounded-2xl border border-[#3647dc]/10">
              <button className="w-full text-xs font-bold text-[#3647dc] hover:text-[#2739d0] transition-colors">Xem bảng xếp hạng đầy đủ</button>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
