"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { getSupabase } from "@/app/lib/supabase";
import { Conversation, Message, User } from "./types";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const targetConvId = searchParams?.get("conv");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Use refs for polling to avoid dependency cycle in setInterval
  const selectedConvIdRef = useRef<string | null>(null);
  selectedConvIdRef.current = selectedConvId;

  // 1. Get current logged in user
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        window.location.href = "/auth/login"; // Redirect if not logged in
      }
    } catch {
      window.location.href = "/auth/login";
    }
  }, []);

  // 2. Fetch Conversations
  const fetchConversations = useCallback(async () => {
    try {
      const data = await apiFetch<any>('/chat/conversations');
      setConversations(data.data || []);
      
      // Select the conversation from query parameter if it exists and not selected yet
      if (targetConvId && !selectedConvIdRef.current) {
        setSelectedConvId(targetConvId);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, [targetConvId]);

  // Handle polling conversations
  useEffect(() => {
    if (!currentUser?.id) return;
    
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [currentUser?.id, fetchConversations]);

  // 3. Fetch Messages for Selected Conversation
  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const data = await apiFetch<any>(`/chat/conversations/${convId}/messages?page=1&limit=50`);
      // Backend already returns oldest→newest (ASC), no need to reverse
      const msgs = Array.isArray(data.data) ? data.data : [];
      setMessages(msgs);
    } catch (err) {
      console.error(`Failed to load messages for ${convId}:`, err);
    }
  }, []);

  // Supabase Realtime for instant message sync + initial fetch
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }
    
    // Initial fetch
    fetchMessages(selectedConvId);

    // Subscribe to new messages via Supabase Realtime
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const supabase = getSupabase(token);

    const channel = supabase.channel(`messages_${selectedConvId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConvId}`,
      }, () => {
        // Refetch from API to get full sender relation data
        if (selectedConvIdRef.current) {
          fetchMessages(selectedConvIdRef.current);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConvId, fetchMessages]);


  // 4. Send Message Function with Optimistic UI
  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!selectedConvId || !currentUser) return;

    // Optimistic UI — show message instantly before API responds
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConvId,
      sender_id: currentUser.id,
      content: content || "",
      image_url: imageUrl || "",
      message_type: imageUrl ? 'image' : 'text',
      is_read: false,
      read_at: "",
      created_at: new Date().toISOString(),
      sender: { id: currentUser.id, full_name: currentUser.full_name || "Tôi" },
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const payload: any = { message_type: imageUrl ? 'image' : 'text' };
      if (content) payload.content = content;
      if (imageUrl) payload.image_url = imageUrl;

      await apiFetch(`/chat/conversations/${selectedConvId}/messages`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Realtime will auto-refresh, but also fetch to be safe
      fetchMessages(selectedConvId);
      // Update conv list (last message preview)
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      throw error;
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConvId) || null;

  if (!currentUser) return null; // Or a loading spinner

  return (
    <div className="flex-1 flex overflow-hidden rounded-2xl shadow-sm border transition-colors h-[calc(100vh-8rem)]" style={{ borderColor: "var(--color-border-subtle)", backgroundColor: "var(--color-bg-card)" }}>
      {/* Left Pane: Contact List */}
      <ConversationList 
        conversations={conversations}
        selectedId={selectedConvId}
        onSelect={setSelectedConvId}
        currentUserId={currentUser.id}
      />

      {/* Right Pane: Active Conversation & Input */}
      <div className="flex-1 flex flex-col relative h-full">
        <ChatWindow 
          conversation={selectedConversation}
          messages={messages}
          currentUserId={currentUser.id}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={!selectedConvId}
        />
      </div>
    </div>
  );
}
