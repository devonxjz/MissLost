import { Conversation } from "./types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  currentUserId: string;
}

export default function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect, 
  currentUserId 
}: ConversationListProps) {
  return (
    <section className="w-80 flex flex-col border-r border-[#f1f5f9] bg-[var(--color-bg-card-solid)]/30 backdrop-blur-md transition-colors h-full">
      <div className="p-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: "var(--color-text-primary)" }}>
          Tin nhắn
        </h1>
        <div className="flex gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "var(--color-brand-bg)", color: "var(--color-brand)" }}>
            Tất cả
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "var(--color-bg-input)", color: "var(--color-text-secondary)" }}>
            Chưa đọc
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {conversations.length === 0 ? (
          <div className="text-center p-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Chưa có đoạn chat nào.
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = conv.id === selectedId;
            // Xác định người đối diện trong cuộc chat
            const partner = conv.user_a_id === currentUserId ? conv.user_b : conv.user_a;
            const partnerName = partner?.full_name || "Người dùng ẩn danh";
            
            // Xử lý avatar
            const avatarUrl = partner?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=f1f3f9&color=5f6368`;
            
            // Tin nhắn cuối
            const lastMsg = conv.last_message;
            let lastMsgText = lastMsg ? (lastMsg.content || (lastMsg.image_url ? "[Hình ảnh]" : "[Tin nhắn hệ thống]")) : "Chưa có tin nhắn";
            
            // Thời gian
            const timeStr = lastMsg?.created_at 
                ? formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: true, locale: vi })
                : "";

            return (
              <div 
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`p-4 rounded-2xl flex gap-3 cursor-pointer transition-all ${isSelected ? "shadow-sm" : "hover:bg-[var(--color-bg-card-solid)]/40"}`}
                style={{
                  backgroundColor: isSelected ? "var(--color-bg-card)" : "transparent",
                  border: isSelected ? "1px solid var(--color-border-primary)" : "1px solid transparent"
                }}
              >
                <div className="relative shrink-0">
                  <img 
                    alt="Avatar" 
                    className="h-12 w-12 rounded-full object-cover border" 
                    style={{ borderColor: "var(--color-border-subtle)" }}
                    src={avatarUrl}
                  />
                  {/* Badge chưa đọc - giả lập cho đẹp nếu unread_count > 0 định nghĩa từ API */}
                  {conv.unread_count && conv.unread_count > 0 ? (
                    <div className="absolute top-0 right-0 h-4 w-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                      {conv.unread_count}
                    </div>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm truncate" style={{ color: "var(--color-text-primary)" }}>
                      {partnerName}
                    </h3>
                    <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                      {timeStr.replace('khoảng ', '').replace(' trước', '')}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${conv.unread_count ? 'font-bold' : ''}`} style={{ color: conv.unread_count ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                    {lastMsg?.sender_id === currentUserId ? "Bạn: " : ""}{lastMsgText}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
