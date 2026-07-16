// lib/placeholder-data.ts
export const mockConversations = [
  {
    id: 1,
    name: "Elena Rostova",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    lastMessage: "I just sent the Figma files over!",
    time: "10:42 AM",
    unread: 2,
    online: true,
    isPinned: true,
    typing: false,
    isSent: false,
  },
  {
    id: 2,
    name: "Design Team",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
    lastMessage: "Alex: We need to update the spacing on the navigation...",
    time: "Yesterday",
    unread: 0,
    online: false,
    isPinned: true,
    typing: false,
    isSent: false,
  },
  {
    id: 3,
    name: "Alex Mercer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    lastMessage: "Sounds good. See you tomorrow.",
    time: "Tuesday",
    unread: 0,
    online: true,
    isPinned: false,
    typing: false,
    isSent: true,
    isRead: true,
  },
  {
    id: 4,
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
    lastMessage: "",
    time: "Mon",
    unread: 0,
    online: true,
    isPinned: false,
    typing: true,
    isSent: false,
  }
];

export const mockMessages = [
  {
    id: 1,
    senderId: 'other',
    text: "Hey! How's the progress on the new ChatFlow UI?",
    time: "10:30 AM",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    id: 2,
    senderId: 'me',
    text: "Going great! I'm implementing the liquid glass effects right now. It looks incredibly premium.",
    time: "10:32 AM",
    avatar: "https://i.pravatar.cc/150?u=me"
  },
  {
    id: 3,
    senderId: 'other',
    text: "That sounds awesome. Did you add the ambient mesh gradients in the background? They really sell the Apple VisionOS vibe.",
    time: "10:35 AM",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    id: 4,
    senderId: 'me',
    text: "Yes, fully animated with Framer Motion. They react smoothly. I'll push the code in an hour.",
    time: "10:40 AM",
    avatar: "https://i.pravatar.cc/150?u=me"
  },
  {
    id: 5,
    senderId: 'other',
    text: "Perfect. I just sent the Figma files over!",
    time: "10:42 AM",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  }
];