"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function Home() {
  useEffect(() => {
    const conversationId = "d66b4bc9-aaed-4410-a79e-d4cc39b277d2";

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Join conversation room
      socket.emit("join-room", conversationId);

      // Send a test message
      socket.emit("send-message", {
        conversationId,
        content: "Hello from Socket.IO!",
      });
    });

    // Listen for new messages
    socket.on("new-message", (message) => {
      console.log("📩 New Message:", message);
    });

    return () => {
      socket.off("connect");
      socket.off("new-message");
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>ChatFlow</h1>
    </div>
  );
}