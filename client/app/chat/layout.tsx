// app/chat/layout.tsx
"use client";

import { ThemeProvider } from "next-themes";
import React from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}