"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
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
      // Set page 1 limit 50 for now, could add pagination later
      const data = await apiFetch<any>(`/chat/conversations/${convId}/messages?page=1&limit=50`);
      // API typically returns latest first if ORDER BY created_at DESC, so we reverse it for UI (oldest top, newest bottom)
      const msgs = Array.isArray(data.data) ? data.data : [];
      setMessages([...msgs].reverse());
    } catch (err) {
      console.error(`Failed to load messages for ${convId}:`, err);
    }
  }, []);

  // Poll Messages every 3s if there is an active conversation
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }
    
    // Initial fetch when selected changes
    fetchMessages(selectedConvId);

    // Setup polling
    const interval = setInterval(() => {
      if (selectedConvIdRef.current) {
        fetchMessages(selectedConvIdRef.current);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedConvId, fetchMessages]);


  // 4. Send Message Function
  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!selectedConvId) return;

    // Optimistic UI update could go here
    try {
      const payload: any = { message_type: imageUrl ? 'image' : 'text' };
      if (content) payload.content = content;
      if (imageUrl) payload.image_url = imageUrl;

      await apiFetch(`/chat/conversations/${selectedConvId}/messages`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Refetch immediately
      fetchMessages(selectedConvId);
      // Also refetch conv list to update last message
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
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
