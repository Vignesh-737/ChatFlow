import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { sendMessageService } from "../services/message.service.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user.userId;
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({
        message: "Conversation ID and content are required",
      });
    }

    const message = await sendMessageService({
      conversationId,
      senderId,
      content,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};


type MessageParams = {
  conversationId: string;
};

export const getMessages = async (req: Request<MessageParams>,res: Response) => {
  try {
    const myUserId = req.user.userId;
    const { conversationId } = req.params;

    // Validation
    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation ID is required",
      });
    }

    // Verify conversation exists AND user belongs to it
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        members: {
          some: {
            userId: myUserId,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found or access denied",
      });
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: {
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
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};