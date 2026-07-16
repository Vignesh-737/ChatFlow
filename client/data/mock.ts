// data/mock.ts
import { User, Message, Conversation } from "../types";

export const currentUser: User = {
  id: "u1",
  name: "Alex",
  avatar: "https://i.pravatar.cc/150?img=11",
  status: "online",
};

export const mockUsers: User[] = [
  { id: "u2", name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?img=43", status: "online" },
  { id: "u3", name: "David Chen", avatar: "https://i.pravatar.cc/150?img=15", status: "offline", lastSeen: "2h ago" },
  { id: "u4", name: "Elena Rodriguez", avatar: "https://i.pravatar.cc/150?img=32", status: "idle" },
  { id: "u5", name: "Design Team", avatar: "https://i.pravatar.cc/150?img=44", status: "online" },
];

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    participants: [mockUsers[0]],
    isPinned: true,
    unreadCount: 3,
    messages: [
      { id: "m1", senderId: "u2", text: "Hey Alex, are we still on for the meeting today?", timestamp: "10:30 AM", isRead: false },
    ]
  },
  {
    id: "c2",
    participants: [mockUsers[1]],
    isPinned: false,
    unreadCount: 0,
    messages: [
      { id: "m2", senderId: "u1", text: "I sent over the figma files.", timestamp: "Yesterday", isRead: true },
      { id: "m3", senderId: "u3", text: "Got them, thanks! The new glass components look amazing.", timestamp: "Yesterday", isRead: true },
    ]
  },
  {
    id: "c3",
    participants: [mockUsers[2]],
    isPinned: false,
    unreadCount: 0,
    typing: ["u4"],
    messages: [
      { id: "m4", senderId: "u4", text: "Could you review the PR when you have a moment?", timestamp: "Tuesday", isRead: true },
    ]
  }
];