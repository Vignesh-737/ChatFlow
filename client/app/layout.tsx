// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ChatFlow | Sign In",
  description: "Sign in to ChatFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-zinc-50 dark:bg-[#05010d] text-zinc-900 dark:text-white min-h-screen selection:bg-indigo-500/30`}>
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
              {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
