import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AuthGate } from "@/components/AuthGate";
import { Nav } from "@/components/Nav";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["opsz"] });

export const metadata: Metadata = {
  title: "IELTS Coach · with Yuvraj",
  description: "Your personal IELTS General Training coach: real-exam practice in all four modules, a study plan and progress towards CLB 9.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <AuthGate>
          <Nav />
          <main className="container">{children}</main>
        </AuthGate>
      </body>
    </html>
  );
}
