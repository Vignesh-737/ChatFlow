import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
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
      ({
        conversationId,
        content,
      }: {
        conversationId: string;
        content: string;
      }) => {
        console.log(
          `📩 Message received in ${conversationId}: ${content}`
        );

        // Send the message to everyone in the room
        io.to(conversationId).emit("new-message", {
          conversationId,
          content,
          senderId: socket.id,
        });
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