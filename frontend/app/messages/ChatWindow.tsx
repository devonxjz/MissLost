import { Conversation, Message, Trigger } from "./types";
import { format } from "date-fns";
import { useEffect, useRef, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
}

export default function ChatWindow({ conversation, messages, currentUserId }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [triggerActionLoading, setTriggerActionLoading] = useState(false);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load trigger via polling (avoid Supabase realtime — anon key has no permission on triggers table)
  const loadTrigger = useCallback(async () => {
    if (!conversation?.id) return;
    try {
      const triggers = await apiFetch<Trigger[]>(`/triggers/conversation/${conversation.id}`);
      setTrigger(triggers[0] || null);
    } catch (err) {
      // Silently ignore — user may not have trigger access for some conversations
      console.warn("Trigger load skipped", err);
      setTrigger(null);
    }
  }, [conversation?.id]);

  useEffect(() => {
    if (!conversation?.id) {
      setTrigger(null);
      return;
    }

    setTriggerLoading(true);
    loadTrigger().finally(() => setTriggerLoading(false));

    // Poll every 10s instead of Supabase realtime
    const interval = setInterval(loadTrigger, 10000);
    return () => clearInterval(interval);
  }, [conversation?.id, loadTrigger]);

  const handleCreateTrigger = async () => {
    if (!conversation) return;
    try {
      setTriggerActionLoading(true);
      const targetUserId = conversation.user_a_id === currentUserId ? conversation.user_b_id : conversation.user_a_id;
      
      await apiFetch('/triggers', {
        method: 'POST',
        body: JSON.stringify({
          post_id: conversation.lost_post_id || conversation.found_post_id,
          post_type: conversation.found_post_id ? 'found' : 'lost',
          target_user_id: targetUserId,
          conversation_id: conversation.id
        })
      });
      // realtime will automatically reload trigger
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    } finally {
      setTriggerActionLoading(false);
    }
  };

  const handleConfirmTrigger = async () => {
    if (!trigger) return;
    try {
      setTriggerActionLoading(true);
      await apiFetch(`/triggers/${trigger.id}/confirm`, {
        method: 'POST'
      });
      alert('Đã xác nhận trao trả thành công! Điểm rèn luyện đã được cộng.');
      // realtime will automatically reload trigger
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    } finally {
      setTriggerActionLoading(false);
    }
  };

  if (!conversation) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center bg-[var(--color-bg-card-solid)]/40 backdrop-blur-sm relative">
        <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-bg-input)", color: "var(--color-text-muted)" }}>
          <span className="material-symbols-outlined text-4xl">forum</span>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Chưa chọn cuộc trò chuyện</h2>
        <p className="text-sm max-w-sm text-center" style={{ color: "var(--color-text-secondary)" }}>
          Chọn một cuộc trò chuyện ở danh sách bên trái hoặc bắt đầu cuộc trò chuyện mới từ các bài đăng Mất đồ/Nhặt được.
        </p>
      </section>
    );
  }

  const partner = conversation.user_a_id === currentUserId ? conversation.user_b : conversation.user_a;
  const partnerName = partner?.full_name || "Người dùng ẩn danh";
  const avatarUrl = partner?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=f1f3f9&color=5f6368`;

  // Current user info for avatar on own messages
  const currentUserData = conversation.user_a_id === currentUserId ? conversation.user_a : conversation.user_b;
  const currentUserAvatar = currentUserData?.avatar_url || null;

  const renderTriggerBanner = () => {
    if (triggerLoading) {
      return (
         <div className="flex items-center justify-center w-full my-2">
            <span className="text-xs text-[var(--color-text-muted)] animate-pulse">Đang tải trạng thái trao trả...</span>
         </div>
      );
    }

    if (!trigger || trigger.status === 'expired' || trigger.status === 'cancelled') {
        return (
          <div className="flex items-center justify-between w-full my-2 px-6 py-3 bg-[var(--color-bg-card)] rounded-xl border" style={{borderColor: "var(--color-border-subtle)", borderStyle: "dashed"}}>
            <span className="text-sm font-medium" style={{color: "var(--color-text-secondary)"}}>
              Chưa có yêu cầu xác nhận trao trả.
            </span>
            <button 
              onClick={handleCreateTrigger} 
              disabled={triggerActionLoading}
              className="px-5 py-2 rounded-full text-xs font-bold uppercase text-white transition-opacity disabled:opacity-50 shadow-md"
              style={{ backgroundColor: "var(--color-brand)" }}
            >
              {triggerActionLoading ? "Đang xử lý..." : "Tạo yêu cầu trao trả"}
            </button>
          </div>
        );
    }

    if (trigger.status === 'pending') {
       if (trigger.target?.id === currentUserId) {
         return (
           <div className="flex items-center justify-between w-full my-2 px-6 py-4 rounded-xl border bg-green-500/10 border-green-500/30">
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-green-600 text-3xl">handshake</span>
               <div>
                  <h4 className="text-sm font-bold text-green-700">Yêu cầu xác nhận nhận đồ</h4>
                  <p className="text-xs text-green-600/80">Vui lòng bấm xác nhận nếu bạn đã nhận lại vật phẩm.</p>
               </div>
             </div>
             <button 
               onClick={handleConfirmTrigger} 
               disabled={triggerActionLoading}
               className="px-5 py-2 rounded-full text-sm font-bold uppercase text-white transition-all disabled:opacity-50 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30"
             >
               {triggerActionLoading ? "Đang xử lý..." : "Xác nhận & Cảm ơn"}
             </button>
           </div>
         );
       } else {
         return (
           <div className="flex items-center justify-between w-full my-2 px-6 py-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-sm font-bold text-amber-700">
                  Đang chờ {partnerName} xác nhận...
                </span>
             </div>
           </div>
         );
       }
    }

    if (trigger.status === 'confirmed') {
      return (
         <div className="flex items-center justify-center gap-2 w-full my-2 px-6 py-4 rounded-xl bg-blue-500/10 border border-blue-500/30 shadow-inner">
           <span className="material-symbols-outlined text-blue-600 text-2xl">verified</span>
           <span className="text-sm font-bold text-blue-700">
             Giao dịch trao trả thành công! Điểm rèn luyện đã được cộng. 🎉
           </span>
         </div>
      );
    }
  };

  return (
    <section className="flex-1 flex flex-col bg-[var(--color-bg-card-solid)]/40 backdrop-blur-sm relative h-full overflow-hidden">
      {/* Conversation Header */}
      <div className="p-4 px-8 border-b flex justify-between items-center bg-[var(--color-bg-card)] z-10" style={{ borderColor: "var(--color-border-subtle)" }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover border"
              style={{ borderColor: "var(--color-border-subtle)" }}
              src={avatarUrl}
            />
            {/* Active badge */}
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-extrabold" style={{ color: "var(--color-text-primary)" }}>{partnerName}</h2>
            {conversation.lost_post_id && (
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-brand)" }}>Về bài đăng Mất đồ</p>
            )}
            {conversation.found_post_id && (
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-brand)" }}>Về bài đăng Nhặt được</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full transition-all hover:bg-black/5" style={{ color: "var(--color-text-secondary)" }}>
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
      </div>

      {/* Trigger Banner Area */}
      <div className="px-8 pt-4 pb-2 z-10 bg-gradient-to-b from-[var(--color-bg-card)] to-transparent">
        {renderTriggerBanner()}
      </div>

      {/* Chat Canvas */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 pb-8 pt-2 space-y-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 ? (
          <div className="flex justify-center w-full mt-10">
            <p className="text-sm italic" style={{ color: "var(--color-text-muted)" }}>Hãy gửi lời chào đến {partnerName}!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId;

            // System message
            if (msg.message_type === "system") {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-tighter" style={{ backgroundColor: "var(--color-bg-input)", color: "var(--color-text-muted)" }}>
                    {msg.content}
                  </span>
                </div>
              );
            }

            // Normal messages — sender avatar from msg.sender relation
            const senderName = msg.sender?.full_name || (isMe ? "Tôi" : partnerName);
            const senderAvatar = msg.sender?.avatar_url
              || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=${isMe ? '4F46E5' : 'f1f3f9'}&color=${isMe ? 'ffffff' : '5f6368'}`;

            return (
              <div key={msg.id} className={`flex items-end gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
                {/* Avatar — show for both sides to distinguish users */}
                <img
                  alt={senderName}
                  className="h-8 w-8 rounded-full object-cover border shrink-0"
                  style={{ borderColor: isMe ? "var(--color-brand)" : "var(--color-border-subtle)" }}
                  src={isMe ? (currentUserAvatar || senderAvatar) : senderAvatar}
                />

                <div className="flex flex-col gap-1">
                  {msg.image_url && (
                    <img
                      src={msg.image_url}
                      alt="Attachment"
                      className={`max-w-xs rounded-2xl ${isMe ? 'rounded-br-none' : 'rounded-bl-none'} object-cover border`}
                      style={{ borderColor: isMe ? "transparent" : "var(--color-border-subtle)" }}
                      loading="lazy"
                    />
                  )}
                  {msg.content && (
                    <div
                      className={`p-4 text-sm leading-relaxed rounded-2xl shadow-sm ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}
                      style={{
                        backgroundColor: isMe ? "var(--color-brand)" : "var(--color-bg-card)",
                        color: isMe ? "#ffffff" : "var(--color-text-primary)",
                      }}
                    >
                      {msg.content}
                    </div>
                  )}
                  <span className={`text-[10px] ${isMe ? 'text-right' : 'text-left'}`} style={{ color: "var(--color-text-muted)" }}>
                    {format(new Date(msg.created_at), 'HH:mm')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
