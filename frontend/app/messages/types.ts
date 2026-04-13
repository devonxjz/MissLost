export interface User {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface Conversation {
  id: string;
  lost_post_id?: string;
  found_post_id?: string;
  user_a_id: string;
  user_b_id: string;
  last_message_at?: string;
  created_at: string;
  
  // Relations returned from API
  user_a?: User;
  user_b?: User;
  unread_count?: number;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  image_url: string;
  message_type: 'text' | 'image' | 'system' | 'handover_request';
  is_read: boolean;
  read_at: string;
  created_at: string;

  // Relation
  sender?: User;
}
