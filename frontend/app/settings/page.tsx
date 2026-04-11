export default function SettingsPage() {
  return (
    <main className="flex-1 p-10">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#2c2f33] mb-2">Cài đặt hệ thống</h1>
        <p className="text-[#595b61] leading-relaxed max-w-2xl">Quản lý tài khoản của bạn, cập nhật thông báo và điều chỉnh bảo mật để có trải nghiệm MissLost tốt nhất.</p>
      </header>

      {/* Bento Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <section className="lg:col-span-8 bg-white/75 backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#3647dc]/10 flex items-center justify-center text-[#3647dc]">
              <span className="material-symbols-outlined text-3xl">person</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Thông tin cá nhân</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#595b61] ml-2">Họ và tên</label>
              <input className="w-full bg-[#eff0f7] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#3647dc]/20 focus:bg-white transition-all text-[#2c2f33] font-medium" type="text" defaultValue="Nguyễn Thành Nam"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#595b61] ml-2">Email</label>
              <input className="w-full bg-[#eff0f7] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#3647dc]/20 focus:bg-white transition-all text-[#2c2f33] font-medium" type="email" defaultValue="nam.nt@misslost.vn"/>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-[#595b61] ml-2">Tiểu sử</label>
              <textarea className="w-full bg-[#eff0f7] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#3647dc]/20 focus:bg-white transition-all text-[#2c2f33] font-medium" rows={3} defaultValue="Lạc quan và hay quên. Hy vọng cộng đồng sẽ giúp mình tìm lại những món đồ thất lạc."/>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button className="px-8 py-3 bg-[#3647dc] text-white rounded-full font-bold hover:shadow-xl hover:shadow-[#3647dc]/30 transition-all active:scale-95">Lưu thay đổi</button>
          </div>
        </section>

        {/* Language Card */}
        <section className="lg:col-span-4 bg-white/75 backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#734a90]/10 flex items-center justify-center text-[#734a90]">
              <span className="material-symbols-outlined text-3xl">language</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Ngôn ngữ</h2>
          </div>
          <div className="flex flex-col gap-4">
            <button className="flex items-center justify-between p-4 bg-[#3647dc]/10 border-2 border-[#3647dc]/20 rounded-2xl transition-all">
              <span className="font-bold text-[#3647dc]">Tiếng Việt</span>
              <span className="material-symbols-outlined text-[#3647dc]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </button>
            <button className="flex items-center justify-between p-4 bg-[#dadde5]/30 rounded-2xl hover:bg-[#dadde5]/50 transition-all">
              <span className="font-medium text-[#2c2f33]">English</span>
            </button>
            <button className="flex items-center justify-between p-4 bg-[#dadde5]/30 rounded-2xl hover:bg-[#dadde5]/50 transition-all">
              <span className="font-medium text-[#2c2f33]">日本語</span>
            </button>
          </div>
        </section>

        {/* Security Card */}
        <section className="lg:col-span-6 bg-white/75 backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#b41340]/10 flex items-center justify-center text-[#b41340]">
              <span className="material-symbols-outlined text-3xl">security</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Bảo mật tài khoản</h2>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-bold text-[#2c2f33]">Xác thực 2 yếu tố (2FA)</p>
                <p className="text-sm text-[#595b61]">Tăng cường bảo mật đăng nhập</p>
              </div>
              {/* Toggle ON */}
              <div className="w-12 h-6 bg-[#8c98ff] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <hr className="border-slate-200/50"/>
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-bold text-[#2c2f33]">Mật khẩu</p>
                <p className="text-sm text-[#595b61]">Cập nhật mật khẩu định kỳ</p>
              </div>
              <button className="text-[#3647dc] font-bold text-sm">Đổi mật khẩu</button>
            </div>
          </div>
        </section>

        {/* Notifications Card */}
        <section className="lg:col-span-6 bg-white/75 backdrop-blur-xl p-8 rounded-lg shadow-sm border border-white/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#4050bc]/10 flex items-center justify-center text-[#4050bc]">
              <span className="material-symbols-outlined text-3xl">notifications_active</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Thông báo</h2>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-bold text-[#2c2f33]">Thông báo qua Email</p>
                <p className="text-sm text-[#595b61]">Nhận tin nhắn và cập nhật mới</p>
              </div>
              {/* Toggle OFF */}
              <div className="w-12 h-6 bg-[#dadde5] rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <hr className="border-slate-200/50"/>
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-bold text-[#2c2f33]">Tin nhắn trực tiếp</p>
                <p className="text-sm text-[#595b61]">Thông báo khi có người chat</p>
              </div>
              {/* Toggle ON */}
              <div className="w-12 h-6 bg-[#8c98ff] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
