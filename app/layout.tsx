import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Nutrix - Calorie & Macro Tracker",
  description: "Track your calories and macros with ease",
  icons: {
    icon: '/nutrix.svg',
    shortcut: '/nutrix.svg',
    apple: '/nutrix.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
