import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arkansas Scratch Finder",
  description: "A fictional sample reference for finding scratch-off game slots.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Scratch Finder"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0e7"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
