export interface Conversation {
  id: string;
  isGroup: boolean;
  name: string | null;
  updatedAt: string;

  members: {
    user: {
      id: string;
      username: string;
      email: string;
    };
  }[];

  messages: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  }[];
}