import type { Metadata, Viewport } from "next";
import { AuthGate } from "@/components/AuthGate";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "IELTS Coach",
  description: "Your personal IELTS General Training coach: real-exam practice in all four modules, a study plan and progress towards CLB 9.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGate>
          <Nav />
          <main className="container">{children}</main>
        </AuthGate>
      </body>
    </html>
  );
}
