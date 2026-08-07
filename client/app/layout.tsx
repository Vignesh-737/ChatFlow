// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "./providers";
import { Toaster } from "sonner";

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
          <Toaster
            richColors
            position="top-center"
            theme="system"
            toastOptions={{
              className: "!py-3.5 !px-5 !text-sm sm:!text-base sm:!min-w-[380px] sm:!max-w-[500px] !rounded-2xl !shadow-2xl !border !border-black/10 dark:!border-white/15",
              style: {
                minHeight: "56px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
