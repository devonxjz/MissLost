export default function TrustScorePage() {
  return (
    <main className="flex-1 p-6 md:p-10 space-y-10">
      {/* Hero Trust Score Header */}
      <section className="relative rounded-lg overflow-hidden h-[400px] flex items-center p-12 bg-indigo-900">
        <img
          alt="Abstract indigo background"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8pHuhLyEdRGmaYSd1ohF1k5-yULu_n8X-K4aF8B-BJ52O9CY1AFRULyq6n6Zsj9DdUnaeOAFSmlJgZcrWztxZPvQyq5XwS1Segk0kGIcoFCfYDHEVwgPV13AcwRw-Lt-J3Mi52FmBFmRLqNnjr4B_GMEkyZbdBOOYe5cppaI4zH9P-a-3sjbksKKtaWqNYpdQGzM0iX1BTzJVyxJaBZNPUKy3_-wLOtFg1z6jaWeVt5tupYgvclYt27w55grd2zrGOrttBI1nGL8"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900/40 to-transparent"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter mb-4 leading-tight">Điểm Uy Tín</h1>
            <p className="text-indigo-100 text-lg max-w-md opacity-90 leading-relaxed">Hệ thống đánh giá sự tin cậy dựa trên các hoạt động tìm kiếm và trả lại đồ thất lạc trong cộng đồng.</p>
            <div className="flex gap-4 mt-8">
              <div className="bg-[var(--color-bg-card-solid)]/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <span className="text-white font-bold">Xếp hạng: Vàng</span>
              </div>
              <div className="bg-indigo-600 px-6 py-3 rounded-full shadow-lg shadow-indigo-900/50">
                <span className="text-white font-bold">Top 2% Toàn quốc</span>
              </div>
            </div>
          </div>
          {/* SVG Score Indicator */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
                <circle className="text-white/10" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="12"></circle>
                <circle className="text-[#8c98ff]" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeDasharray="691" strokeDashoffset="103" strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-7xl font-black tracking-tighter">850</span>
                <span className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Trust Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trust Levels */}
        <div className="lg:col-span-1 bg-[var(--color-bg-card)] backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Cấp bậc uy tín</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-input)] transition-all hover:bg-[var(--color-bg-input-hover)]">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
              </div>
              <div>
                <p className="font-bold">Kim Cương</p>
                <p className="text-xs text-[var(--color-text-secondary)]">900 - 1000 điểm</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-[var(--color-text-muted)]">lock</span>
            </div>
            {/* Active Level */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3647dc]/10 border border-[#3647dc]/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
              </div>
              <div>
                <p className="font-bold text-indigo-600">Vàng</p>
                <p className="text-xs text-indigo-400">700 - 899 điểm</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-indigo-600">check_circle</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-input)] opacity-60">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-muted)] flex items-center justify-center">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <div>
                <p className="font-bold">Bạc</p>
                <p className="text-xs text-[var(--color-text-secondary)]">400 - 699 điểm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-bg-card)] backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Lịch sử hoạt động</h2>
              <button className="text-[#3647dc] font-bold text-sm">Xem tất cả</button>
            </div>
            <div className="space-y-6">
              {/* Wallet Return */}
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">volunteer_activism</span>
                </div>
                <div className="flex-1 pb-6 border-b border-[var(--color-border-subtle)]">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold">Trả lại Ví da bị mất</h4>
                    <span className="text-emerald-600 font-bold">+50 pts</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-2">Đã bàn giao tài sản cho người sở hữu thành công tại Quận 1, TP.HCM.</p>
                  <span className="text-xs text-[var(--color-text-muted)]">2 ngày trước • Xác thực bởi hệ thống</span>
                </div>
              </div>
              {/* Identity Verification */}
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div className="flex-1 pb-6 border-b border-[var(--color-border-subtle)]">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold">Xác minh danh tính</h4>
                    <span className="text-indigo-600 font-bold">+100 pts</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-2">Hoàn tất quy trình KYC và liên kết tài khoản ngân hàng chính chủ.</p>
                  <span className="text-xs text-[var(--color-text-muted)]">1 tuần trước</span>
                </div>
              </div>
              {/* 5 Star Review */}
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">comment</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold">Nhận đánh giá 5 sao</h4>
                    <span className="text-amber-600 font-bold">+15 pts</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-2">&quot;Rất nhiệt tình và trung thực, cảm ơn bạn nhiều!&quot; - Minh Anh.</p>
                  <span className="text-xs text-[var(--color-text-muted)]">2 tuần trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-black tracking-tighter text-[var(--color-text-primary)]">Danh hiệu đạt được</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="bg-[var(--color-bg-card)] backdrop-blur-xl p-6 rounded-lg text-center space-y-4 group transition-all hover:-translate-y-2 shadow-sm border border-white/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-300 p-1">
              <div className="w-full h-full rounded-full bg-[var(--color-bg-card-solid)] flex items-center justify-center text-indigo-500">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>handshake</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-sm">Người tử tế</p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Lvl. 3</p>
            </div>
          </div>
          <div className="bg-[var(--color-bg-card)] backdrop-blur-xl p-6 rounded-lg text-center space-y-4 group transition-all hover:-translate-y-2 shadow-sm border border-white/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-1">
              <div className="w-full h-full rounded-full bg-[var(--color-bg-card-solid)] flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>local_police</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-sm">Hiệp sĩ đường phố</p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Lvl. 1</p>
            </div>
          </div>
          <div className="bg-[var(--color-bg-card)] backdrop-blur-xl p-6 rounded-lg text-center space-y-4 group transition-all hover:-translate-y-2 shadow-sm border border-white/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 p-1">
              <div className="w-full h-full rounded-full bg-[var(--color-bg-card-solid)] flex items-center justify-center text-emerald-500">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>energy_savings_leaf</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-sm">Tận tâm</p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Lvl. 5</p>
            </div>
          </div>
          {/* Locked */}
          <div className="bg-[var(--color-bg-card)] backdrop-blur-xl p-6 rounded-lg text-center space-y-4 opacity-40 grayscale transition-all hover:grayscale-0 shadow-sm border border-white/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-bg-input-hover)] flex items-center justify-center text-[var(--color-text-muted)]">
              <span className="material-symbols-outlined text-4xl">lock</span>
            </div>
            <div>
              <p className="font-bold text-sm">Hộ vệ</p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Locked</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
