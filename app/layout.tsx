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
      <body className="min-h-screen bg-yellow-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
