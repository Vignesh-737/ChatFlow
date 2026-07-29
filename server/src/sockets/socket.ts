import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { sendMessageService } from "../services/message.service.js";
import { verifyToken } from "../utils/jwt.js";
import prisma from "../config/prisma.js";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      if (!token && socket.request.headers.cookie) {
        const cookieStr = socket.request.headers.cookie;
        const match = cookieStr.match(/(?:^|;\s*)accessToken=([^;]*)/);
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const payload = verifyToken(token);
      socket.data.userId = payload.userId;

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    const userId = socket.data.userId;

    // Set user online
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: true },
      });
      socket.broadcast.emit("user-status-changed", {
        userId,
        isOnline: true,
      });
    }

    // Join a conversation room
    socket.on("join-room", (conversationId: string) => {
      socket.join(conversationId);

      console.log(
        `${socket.id} joined room ${conversationId}`
      );
    });

    // Receive a message from the client
    socket.on(
        "send-message",
        async ({
          conversationId,
          content,
        }: {
          conversationId: string;
          senderId: string;
          content: string;
        }) => {
          try {
            const senderId = socket.data.userId;
            const message = await sendMessageService({
              conversationId,
              senderId,
              content,
            });

            io.to(conversationId).emit("new-message", message);
          } catch (error) {
            console.error(error);

            socket.emit("error", {
              message:
                error instanceof Error
                  ? error.message
                  : "Something went wrong",
            });
          }
        }
      );

    // Typing indicator: broadcast to everyone in room EXCEPT the sender
    socket.on("typing-start", ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit("user-typing", {
        userId: socket.data.userId,
        conversationId,
      });
    });

    socket.on("typing-stop", ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit("user-stop-typing", {
        userId: socket.data.userId,
        conversationId,
      });
    });

    // Read receipts handler
    socket.on("mark-messages-read", async ({ messageIds, conversationId }: { messageIds: string[], conversationId: string }) => {
      if (!messageIds || messageIds.length === 0) return;

      try {
        await prisma.message.updateMany({
          where: {
            id: { in: messageIds },
            conversationId,
          },
          data: { isRead: true },
        });

        socket.to(conversationId).emit("messages-read", {
          messageIds,
          conversationId,
          readByUserId: socket.data.userId,
        });
      } catch (error) {
        console.error("Failed to mark messages as read:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`❌ User Disconnected: ${socket.id}`);
      if (userId) {
        const lastSeen = new Date();
        await prisma.user.update({
          where: { id: userId },
          data: { isOnline: false, lastSeen },
        });
        socket.broadcast.emit("user-status-changed", {
          userId,
          isOnline: false,
          lastSeen: lastSeen.toISOString(),
        });
      }
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};