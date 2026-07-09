"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function Home() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      socket.emit("hello", {
  name: "Vignesh"
});
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>ChatFlow</h1>
    </div>
  );
}