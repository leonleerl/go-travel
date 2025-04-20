"use client";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <SessionProvider>
            {children}
          </SessionProvider>
        </Theme>
      </body>
    </html>
  );
}
