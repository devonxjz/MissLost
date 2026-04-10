export default function MessagesPage() {
  return (
    <div className="flex-1 flex overflow-hidden rounded-2xl bg-white/40 shadow-sm border border-white/50 h-[calc(100vh-8rem)]">
      {/* Left Pane: Contact List */}
      <section className="w-80 flex flex-col border-r border-slate-100 bg-[#eff0f7]/30 backdrop-blur-md">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2c2f33] mb-2">Messages</h1>
          <div className="flex gap-2 mb-6">
            <span className="bg-[#8c98ff] text-[#000d79] px-3 py-1 rounded-full text-xs font-bold">All</span>
            <span className="bg-[#dadde5] text-[#595b61] px-3 py-1 rounded-full text-xs font-bold">Unread</span>
            <span className="bg-[#dadde5] text-[#595b61] px-3 py-1 rounded-full text-xs font-bold">Archived</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {/* Active Contact */}
          <div className="bg-white/75 backdrop-blur-3xl p-4 rounded-2xl shadow-sm border-0 flex gap-3 cursor-pointer">
            <div className="relative shrink-0">
              <img 
                alt="Avatar" 
                className="h-12 w-12 rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTfeR6e5098_mtAWOVAAw-nV6tZZT71YCQ0baIBhpBtktBDCbo_PvRapz59MpfYVOQZytJqwecmj3urX07IIDNtbOYfmCzphmXgaCM7D8v1lFlWleDKPSG4aBbJzMwDe-fz2MapE2gfIramChiF0Ivzk0ngshSm-ElltRLuYgca5D6gQxAeyj4gsggWvXyKgWauHdc3qPNhurwPJ5VtuLczCCJDHBJjvHg5x8kk0vJd76Z7JbHyHfuV67whocv_w4ugs_N-rHlJKc"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-[#2c2f33] truncate">Minh Thư</h3>
                <span className="text-[10px] text-[#3647dc] font-bold">2m</span>
              </div>
              <p className="text-xs text-[#595b61] font-medium truncate italic">Bạn thấy chiếc ví này ở đâu vậy?</p>
            </div>
          </div>
          
          {/* Other Contacts */}
          <div className="p-4 rounded-2xl flex gap-3 cursor-pointer hover:bg-white/40 transition-all">
            <div className="relative shrink-0">
              <img 
                alt="Avatar" 
                className="h-12 w-12 rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkHTw_zXV6bZvpvJBBtnkscq0WSQUx2t4Ujlr52fxk7qOpZMtgvFctHZVaDsCXoQSKGSV8GYo4_GJPNPHILlDDM6HZ-6BqUIeXVF77zy61Sv_53a1PHIWObMBMa2pe8ghkYug409sbJdp5O4cjrEFBWfASFX_hggthwCenPod5U1IyxawZFwjC9-eelznh3JVmVQZJPazbgrus7GCgYQHb0VouQ4GQ5OYkBqCoD0WnEmP89ThbvCTMES7KaNjys9Cwj56QODnGm7E"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-[#2c2f33] truncate">Hoàng Nam</h3>
                <span className="text-[10px] text-slate-400">1h</span>
              </div>
              <p className="text-xs text-[#595b61] truncate">Cảm ơn bạn nhiều nhé!</p>
            </div>
          </div>
          
          <div className="p-4 rounded-2xl flex gap-3 cursor-pointer hover:bg-white/40 transition-all">
            <div className="relative shrink-0 text-indigo-600 bg-indigo-50 h-12 w-12 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-[#2c2f33] truncate">Group: Tìm đồ thất lạc Q1</h3>
                <span className="text-[10px] text-slate-400">3h</span>
              </div>
              <p className="text-xs text-[#595b61] truncate"><span className="font-bold">Linh:</span> Có ai thấy chìa khóa không...</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl flex gap-3 cursor-pointer hover:bg-white/40 transition-all opacity-70">
            <div className="relative shrink-0">
              <img 
                alt="Avatar" 
                className="h-12 w-12 rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL-zHuoMtLWxY72-12py6I_O6cP0JS0wPIGTa5OuD9Mxw6WmbZvaCCy_HRGXwrmVrjt3dpyi55-VW0lzAmEbUeFnkBM_MsHaMmuPJF6osr6G-NETVJXfFZ4zzuPwiNmTyJJurbA6YqXe1ncWFZwYpSrZxfZn9AegfAx4opEj6H-7mNpNKN7lotelH-nj1BiPEBtRckKFIw-drTiOx9HEvGSFbN_TYJIO1hUHXIZ-fFEj6bils7Q7_s5kazb-UN3RESR0ADEeENR3M"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-[#2c2f33] truncate">Chị Lan (Admin)</h3>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p className="text-xs text-[#595b61] truncate">Trust score của bạn đã tăng lên!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Pane: Active Conversation */}
      <section className="flex-1 flex flex-col bg-white/40 backdrop-blur-sm relative">
        {/* Conversation Header */}
        <div className="p-4 px-8 border-b border-slate-100/50 flex justify-between items-center bg-white/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                alt="Avatar" 
                className="h-10 w-10 rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW_jny_uzbXjAYirIXr8BmU-q9PpsiyIarQp_JlOFevey505B66BLplDqa7BHVF4DkayhmE9YeQXYx4eX39tyywn4m8jK_uysziFSxzYslEbI2XX9_4DeF27sFd1KCsz-F4eioIzlp6MaTCw8rIoiVW13NkFjh9eEzbNEKEyGQDvwjR2t-Z4j58QIFlyj_ZUQXo--x1pt1gI8fgUfnSAWshqcxcvP37VZU71bASO6VXUHWZuFtHG-ZDz0iWp30YpYAlLFEH3V5JAY"
              />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-extrabold text-[#2c2f33]">Minh Thư</h2>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Active Now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#595b61] hover:bg-white/60 rounded-full transition-all">
              <span className="material-symbols-outlined">call</span>
            </button>
            <button className="p-2 text-[#595b61] hover:bg-white/60 rounded-full transition-all">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button className="p-2 text-[#595b61] hover:bg-white/60 rounded-full transition-all">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>

        {/* Chat Canvas */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100/50 px-4 py-1 rounded-full uppercase tracking-tighter">Today, 14:20</span>
          </div>

          <div className="flex items-end gap-3 max-w-[80%]">
            <img 
              alt="Avatar" 
              className="h-8 w-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC32zj0UMbvvjf3aoqMqSrRjfILgdP98jNBW_c0vGnOQTb2A_aa4qBQSlV7C6H_hSrHL5OwRAtkx5YJoRLQUIefAsEkIFb536yFH8fHi9E_xTZF_3253EwuclFxZiyox0FPKUgENaT9S39kiUCulbbMWiverc9s06xnYnzdUcs0KYvWgGi8tBC5bEmq1BWtey7N16cgW6j861HRZelHztPpFpZCX-Sdi0IQo8O864cJq0UVwpX5za8iGVOEyQIUwHHyFGDZIjJul_s"
            />
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl rounded-bl-none shadow-sm text-sm leading-relaxed text-[#2c2f33]">
              Chào bạn Tùng, mình vừa thấy bài đăng của bạn về chiếc ví bị mất ở phố đi bộ.
            </div>
          </div>

          <div className="flex items-end gap-3 max-w-[80%] ml-auto flex-row-reverse">
            <div className="p-4 bg-[#3647dc] text-[#f3f1ff] rounded-2xl rounded-br-none shadow-lg shadow-[#3647dc]/10 text-sm leading-relaxed">
              Chào Thư! Đúng rồi, mình làm rơi khoảng 3h chiều nay. Bạn có thấy nó không?
            </div>
          </div>

          <div className="flex items-end gap-3 max-w-[80%]">
            <img 
              alt="Avatar" 
              className="h-8 w-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAlHJvlaePYHxRwkzjOsE17bwz5VrXJaomjzOMr4YBXZNGLrGr7k92M4ER4PHkyteh472aU84rTyR3Aydb-PQ0ipg1gHI7BNwltomL9f-qAjLe1_eNK4Jsvnv1fuzcBlim2jEd0fa7F5r1VfY9AGRfn73iSfb2rVM83QncpLUH9xqCm5Txfj1ojLleQL5ySrUG0J6_vWX7BrsysSZXm2YOYb7KsTmEAYopj_FbMrcZnNTf8jYUNBZpJjkIJPyFQrGe7R4SlaCgt8s"
            />
            <div className="space-y-3">
              <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl rounded-bl-none shadow-sm text-sm leading-relaxed text-[#2c2f33]">
                Mình nhặt được một cái khá giống mô tả gần cửa hàng tiện lợi Circle K. Bạn xem thử ảnh này có phải không nhé?
              </div>
              <div className="bg-white/75 backdrop-blur-3xl p-2 rounded-2xl shadow-md max-w-xs border border-white/50">
                <img 
                  alt="Wallet" 
                  className="rounded-xl w-full h-40 object-cover mb-2" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB94wbwewsNSixblIWhF_AfsoFMVVByqRd9KLpi1i7XhTAZVtbQdM-7i47zlkEK45fG9cf7d88DdsQkNiVPYr0p0rZKYOybVqXB0TFhVpr5pJwACxtXG5paTeYnxZjbUukMMbb3svBtiYn2bIWlS0ThKqhBvlgBVEY7lDzzmrOBR6un-ZH-dPlUX1RspTcpHUR8bX8bM1fCRMhLL2pitil49nYYjKKPb9z294G8dcmJZXZs4mFw9n5JX6qLcE66XeirhtPAHKa4xTw"
                />
                <div className="px-2 pb-1">
                  <p className="text-xs font-bold text-[#2c2f33]">Ví da bò màu nâu</p>
                  <p className="text-[10px] text-[#595b61]">Nhặt được lúc 15:45 tại Quận 1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-11 opacity-40">
            <div className="w-1.5 h-1.5 bg-[#3647dc] rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-[#3647dc] rounded-full animate-pulse" style={{animationDelay: "0.2s"}}></div>
            <div className="w-1.5 h-1.5 bg-[#3647dc] rounded-full animate-pulse" style={{animationDelay: "0.4s"}}></div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 bg-white/40 backdrop-blur-xl border-t border-slate-100/30">
          <div className="max-w-4xl mx-auto flex items-center gap-3 bg-white/75 backdrop-blur-3xl p-2 rounded-full shadow-lg border border-white/80">
            <button className="p-2 text-[#595b61] hover:text-[#3647dc] transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <button className="p-2 text-[#595b61] hover:text-[#3647dc] transition-colors">
              <span className="material-symbols-outlined">image</span>
            </button>
            <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none" placeholder="Nhập tin nhắn..." type="text"/>
            <button className="p-2 text-[#595b61] hover:text-[#3647dc] transition-colors">
              <span className="material-symbols-outlined">mood</span>
            </button>
            <button className="bg-[#3647dc] text-[#f3f1ff] h-10 w-10 rounded-full flex items-center justify-center shadow-lg shadow-[#3647dc]/20 scale-95 active:scale-90 transition-transform">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
