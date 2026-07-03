import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const myUserId = req.user.userId;
    const friendId = req.body.userId;

    if (!friendId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (myUserId === friendId) {
      return res.status(400).json({
        message: "You cannot create a conversation with yourself",
      });
    }

    const friend = await prisma.user.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!friend) {
      return res.status(404).json({
        message: "Friend not found",
      });
    }

    // Check if private conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          {
            members: {
              some: {
                userId: myUserId,
              },
            },
          },
          {
            members: {
              some: {
                userId: friendId,
              },
            },
          },
        ],
      },
      include: {
        members: true,
      },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create conversation + both members atomically
    const conversation = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {},
      });

      await tx.conversationMember.createMany({
        data: [
          {
            conversationId: conversation.id,
            userId: myUserId,
          },
          {
            conversationId: conversation.id,
            userId: friendId,
          },
        ],
      });

      return conversation;
    });

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};