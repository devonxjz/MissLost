export default function StoragePage() {
  return (
    <main className="flex-1 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <header className="mb-12 relative mt-8">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#3647dc]/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[#3647dc] font-bold tracking-widest text-xs uppercase mb-2 block">Mạng lưới tin cậy</span>
              <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tighter leading-none mb-4">Kho lưu trữ</h1>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
                Nơi các vật phẩm thất lạc được bảo quản an toàn bởi các đối tác tin cậy của MissLost.
              </p>
            </div>
            <div className="flex bg-[var(--color-bg-input-hover)] rounded-full p-1 self-start">
              <button className="text-[var(--color-text-secondary)] px-6 py-2 rounded-full font-bold">Bản đồ</button>
              <button className="bg-[var(--color-bg-card-solid)] text-[#3647dc] px-6 py-2 rounded-full font-bold shadow-sm">Danh sách</button>
            </div>
          </div>
        </header>

        {/* Bento Grid of Storage Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Card 1: Police Station */}
          <div className="group relative overflow-hidden bg-[var(--color-bg-card)] backdrop-blur-3xl rounded-lg p-8 shadow-[0_20px_50px_rgba(91,108,255,0.05)] border border-slate-300/15 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(91,108,255,0.1)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#3647dc]/10 rounded-2xl flex items-center justify-center text-[#3647dc]">
                <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>local_police</span>
              </div>
              <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-500/10">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Hoạt động
              </span>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Police Station District 1</h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
              73 Pasteur, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3 overflow-hidden">
                <img alt="Staff" className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcLxObxCYZiPzQQOMeGg12CuDQgqTK7tYimvHgKTGDXa5mDmFtqXIU0L0c1gi6G9LnnJFUMN0hKwZAERFc-bxmSE8iopWYRWD2blgYaFPt6H7kkl5dLWb9Z-usp9lwLCasfyUAc8pvCuopRuIGDLGM-JW0IQx9upfVVlERNos_A4GV7dE10AhCzVxIRd-NmOVHAvL6wvZAkc_3EvwQuHr_Egbb1aBKDDJ3mwdo5srmUkhLeSbCr19oGZPHPw9n_wAz53fLRwRdblY" />
                <div className="h-8 w-8 rounded-full ring-2 ring-white bg-[#caceff] flex items-center justify-center text-[10px] font-bold text-[#2a3aa7]">+24</div>
              </div>
              <span className="text-sm font-bold text-[#3647dc]">42 vật phẩm</span>
            </div>
            <button className="w-full bg-[var(--color-bg-input)] hover:bg-[#3647dc] hover:text-white text-[var(--color-text-secondary)] font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[rgba(54,71,220,0.2)]">
              View items <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Card 2: University */}
          <div className="group relative overflow-hidden bg-[#3647dc]/5 backdrop-blur-3xl rounded-lg p-8 shadow-[0_20px_50px_rgba(91,108,255,0.05)] border border-[#3647dc]/10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(91,108,255,0.15)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#3647dc] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#3647dc]/30">
                <span className="material-symbols-outlined text-3xl">school</span>
              </div>
              <span className="bg-[#3647dc]/20 text-[#3647dc] px-3 py-1 rounded-full text-xs font-bold border border-[#3647dc]/10">Đối tác Vàng</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">University Front Desk</h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
              Block A, 268 Lý Thường Kiệt, Quận 10
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3 overflow-hidden">
                <img alt="Staff" className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjXMFA0ndw4XFFTW2Xcl0ZUu8x7Np3N8tmzPkp0f_1pKH8vBEzfS8-zaYGhx2r-XE-jaRZxtbEtYCenPEY1RRZpvh-e-yBv4g0LmCIZvURf_kgIkbVvsFhOXT_cLY1ufDHaxgwnNq8NdabWv-P5FlVxCFwNKyinPhtv7xeqxkammBBgrPunBCZJzLLII1TUfAcNTcy9GvXZJmIMdx6YhALveHSLQdeOkMjDMGzetLOAXdTQybEua5WbTLm0tBwIK3G0yIXIf1WyqM"/>
                <img alt="Staff" className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVuRYIzxlw07CzKMOX-Z8JzJ5BDHdF6_fJYt21WfW0YLM6rE5FvBHUho3TLBvDC053IIvTnBMly2dUs2nqCsxN_JS_gUenQ1OtjdYD1CG9XdsrDsCwWm-bjMuxCv0FErBL1FFh0cbpRind7KgCx8cnw5u4N5FddS528SYTRWm6EgE2RuSCL2BMiI5tsD7BrfmT4XcJSKs75raR7qp2eYpk-2qMUgeMflcFUaKsU6JjemDG20p8PjgIaCXonnKHf9s3ToIG_hjtTzI"/>
              </div>
              <span className="text-sm font-bold text-[#3647dc]">128 vật phẩm</span>
            </div>
            <button className="w-full bg-[#3647dc] text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#3647dc]/30 hover:scale-[1.02]">
              View items <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Card 3: Supermarket */}
          <div className="group relative overflow-hidden bg-[var(--color-bg-card)] backdrop-blur-3xl rounded-lg p-8 shadow-[0_20px_50px_rgba(91,108,255,0.05)] border border-slate-300/15 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(91,108,255,0.1)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#4050bc]/10 rounded-2xl flex items-center justify-center text-[#4050bc]">
                <span className="material-symbols-outlined text-3xl">storefront</span>
              </div>
              <span className="bg-[var(--color-bg-input-hover)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full text-xs font-bold">Mở cửa 24/7</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Lotte Mart Info Desk</h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
              469 Nguyễn Hữu Thọ, Tân Hưng, Quận 7
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3 overflow-hidden">
                <img alt="Staff" className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoC2n4Jxq0-thxCWiHs1CL6_SPHbOyo26Zhgl95D7T2t-eYnERojo-0AOGHuUmZskDE9WNcHKf9qLmpoEOWgAfxn9ir0fJJ7ZK3pZf5euxIsoEE2CHcqkGlGjunE3sqALJ9PDxVuS6g_ZGvCuZ-_3e8Stkuhd6PueSj00Z-WJVALiZCTSo-02n6fp-uRnnQM6PXTwVw3BnEe2cj9wM2dSYB32E2udoR_u-VkGTjDgP6rc9nBuBtkr09CYQQMf1dVeIQ4BZizsreLs"/>
              </div>
              <span className="text-sm font-bold text-[#3647dc]">15 vật phẩm</span>
            </div>
            <button className="w-full bg-[var(--color-bg-input)] hover:bg-[#3647dc] hover:text-white text-[var(--color-text-secondary)] font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[rgba(54,71,220,0.2)]">
              View items <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Card 4: Coffee Shop */}
          <div className="group relative overflow-hidden bg-[var(--color-bg-card)] backdrop-blur-3xl rounded-lg p-8 shadow-[0_20px_50px_rgba(91,108,255,0.05)] border border-slate-300/15 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(91,108,255,0.1)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#734a90]/10 rounded-2xl flex items-center justify-center text-[#734a90]">
                <span className="material-symbols-outlined text-3xl">coffee</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">The Coffee House</h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
              223 Võ Văn Tần, Quận 3, HCM
            </p>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-bold text-[#3647dc]">8 vật phẩm hiện có</span>
            </div>
            <button className="w-full bg-[var(--color-bg-input)] hover:bg-[#3647dc] hover:text-white text-[var(--color-text-secondary)] font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[rgba(54,71,220,0.2)]">
              View items <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Card 5: Convenience Store */}
          <div className="group relative overflow-hidden bg-[var(--color-bg-card)] backdrop-blur-3xl rounded-lg p-8 shadow-[0_20px_50px_rgba(91,108,255,0.05)] border border-slate-300/15 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(91,108,255,0.1)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#4050bc]/10 rounded-2xl flex items-center justify-center text-[#4050bc]">
                <span className="material-symbols-outlined text-3xl">local_mall</span>
              </div>
              <span className="bg-[var(--color-bg-input-hover)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full text-xs font-bold">Mở cửa 24/7</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Circle K Lê Thánh Tôn</h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
              15B Lê Thánh Tôn, Bến Nghé, Quận 1
            </p>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-bold text-[#3647dc]">12 vật phẩm hiện có</span>
            </div>
            <button className="w-full bg-[var(--color-bg-input)] hover:bg-[#3647dc] hover:text-white text-[var(--color-text-secondary)] font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[rgba(54,71,220,0.2)]">
              View items <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
