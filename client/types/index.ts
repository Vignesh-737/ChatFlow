// types/index.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  isPinned: boolean;
  typing?: string[];
}