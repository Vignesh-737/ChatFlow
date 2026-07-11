import prisma from "../config/prisma.js";

type SendMessageInput = {
  conversationId: string;
  senderId: string;
  content: string;
};

export const sendMessageService = async ({
  conversationId,
  senderId,
  content,
}: SendMessageInput) => {
  // Check conversation exists and sender belongs to it
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      members: {
        some: {
          userId: senderId,
        },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found or access denied");
  }

  // Save message + update conversation timestamp
  const message = await prisma.$transaction(async (tx) => {
    const newMessage = await tx.message.create({
      data: {
        content,
        senderId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    await tx.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return newMessage;
  });

  return message;
};