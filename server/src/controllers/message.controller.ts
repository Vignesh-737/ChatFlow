import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const myUserId = req.user.userId;
    const { conversationId, content } = req.body;

    // Validation
    if (!conversationId || !content) {
      return res.status(400).json({
        message: "Conversation ID and content are required",
      });
    }

    // Check if conversation exists AND user belongs to it
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

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: myUserId,
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

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};