import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Guesser",
  description: "A playful game for kids to practise their sense of time!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: "'Nunito', ui-rounded, system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
