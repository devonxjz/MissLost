import { useState, useRef } from "react";
import { uploadFile } from "@/app/lib/api";

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => Promise<void>;
  disabled: boolean;
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!content.trim() || disabled || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(content.trim());
      setContent("");
    } catch (err) {
      console.error("Failed to send text message", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled || isUploading) return;

    setIsUploading(true);
    try {
      // Giả sử API upload ảnh đã có ở /upload, dùng lib api helper
      const { url } = await uploadFile('/upload', file);
      // Gửi tin nhắn chứa ảnh
      await onSendMessage("", url);
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Lỗi tải ảnh lên.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-6 backdrop-blur-xl border-t" style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border-subtle)" }}>
      <div 
        className="max-w-4xl mx-auto flex items-center gap-3 p-2 rounded-full shadow-lg border transition-colors"
        style={{ 
          backgroundColor: "var(--color-bg-elevated)", 
          borderColor: "var(--color-border-primary)",
          opacity: disabled ? 0.5 : 1
        }}
      >
        <button 
          className="p-2 transition-colors flex items-center justify-center cursor-not-allowed" 
          disabled
          style={{ color: "var(--color-text-muted)" }}
          title="Chức năng đang phát triển"
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
        
        {/* Upload Image Button */}
        <button 
          className="p-2 transition-colors flex items-center justify-center cursor-pointer hover:text-blue-500" 
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          style={{ color: "var(--color-text-secondary)" }}
        >
          <span className="material-symbols-outlined">{isUploading ? "hourglass_empty" : "image"}</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleImageUpload}
        />

        <input 
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none disabled:cursor-not-allowed" 
          style={{ color: "var(--color-text-primary)" }}
          placeholder={disabled ? "Chọn cuộc trò chuyện..." : "Nhập tin nhắn..."} 
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
        />
        
        <button 
          className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-transform ${(!content.trim() || disabled) ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95 cursor-pointer"}`}
          style={{ backgroundColor: "var(--color-brand)", color: "#fff" }}
          onClick={handleSend}
          disabled={!content.trim() || disabled || isSending}
        >
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
        </button>
      </div>
    </div>
  );
}
