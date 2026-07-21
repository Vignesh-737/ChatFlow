export interface UserItem {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: "online" | "offline" | "idle";
}

export interface MessageItem {
  id: string;
  content: string;
  senderId: string;
  conversationId?: string;
  createdAt: string;
  status?: "sending" | "sent" | "error";
  sender?: {
    id: string;
    username: string;
  };
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name: string | null;
  updatedAt: string;

  members: {
    user: UserItem;
  }[];

  messages?: MessageItem[];
}