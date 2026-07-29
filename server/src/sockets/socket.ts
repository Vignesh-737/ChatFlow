import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { sendMessageService } from "../services/message.service.js";
import { verifyToken } from "../utils/jwt.js";

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

  io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

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

    socket.on("disconnect", () => {
      console.log(`❌ User Disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};