import { Conversation, Message } from "./types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
}

export default function ChatWindow({ conversation, messages, currentUserId }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm relative">
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

  return (
    <section className="flex-1 flex flex-col bg-white/40 backdrop-blur-sm relative h-full">
      {/* Conversation Header */}
      <div className="p-4 px-8 border-b flex justify-between items-center" style={{ borderColor: "var(--color-border-subtle)", backgroundColor: "var(--color-bg-card)" }}>
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

      {/* Chat Canvas */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6"
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

            // Trigger/Handover request message
            if (msg.message_type === "handover_request") {
               return (
                <div key={msg.id} className="flex justify-center w-full my-4">
                  <div className="max-w-md w-full p-4 rounded-xl border border-dashed flex flex-col items-center gap-2" style={{ backgroundColor: "var(--color-brand-bg)", borderColor: "var(--color-brand)" }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: "var(--color-brand)" }}>handshake</span>
                    <p className="font-bold text-sm text-center" style={{ color: "var(--color-text-primary)" }}>{isMe ? "Bạn" : partnerName} đã tạo yêu cầu xác nhận trao trả</p>
                    <p className="text-xs text-center mb-2" style={{ color: "var(--color-text-secondary)" }}>
                       {msg.content || "Vui lòng xác nhận rằng bạn đã nhận được đồ vật."}
                    </p>
                  </div>
                </div>
               );
            }

            // Normal messages
            return (
              <div key={msg.id} className={`flex items-end gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
                {!isMe && (
                  <img 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full object-cover border" 
                    style={{ borderColor: "var(--color-border-subtle)" }}
                    src={avatarUrl}
                  />
                )}
                
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
