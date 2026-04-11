export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-8 w-full max-w-[1600px] mx-auto">
        <span className="text-2xl font-bold text-[#5B6CFF] font-headline tracking-tight">MissLost</span>
        <div className="hidden md:flex flex-1 justify-center max-w-xl">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="bg-[#e6e8ef] border-none rounded-full py-2.5 pl-10 pr-4 w-full focus:ring-2 focus:ring-[#3647dc]/20 text-sm transition-all" 
              placeholder="Tìm kiếm đồ thất lạc..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#3647dc] text-[#f3f1ff] px-6 py-2 rounded-full font-bold active:scale-95 duration-200 transition-colors">Đăng bài</button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8c98ff] cursor-pointer">
            <img 
              className="w-full h-full object-cover" 
              alt="Portrait of a young professional man" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS1mxL-WCdKTubi1pKILlnoPGciA84fUxwasfHedn0HJXekFJetItywLfjaFjh8aMRI3WRNplE_Hy9BENBRt-1ZNO7qzrPHIkBgGLT310hynf_ColhYlxsHSx5ouEI5Rqoj3FxpD3uA34eo18BuENDY2cgMOmVZuBgWvtGr9qujx5AL6PRdGCVi8-yLqpYDrYa9uS6GQm_lALKdIgg1HP7w0BGSDWRJnhoEP3n_gs-thK11dsYt8N_hRHpp-Hfd5F4NziXTnje6ag"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
