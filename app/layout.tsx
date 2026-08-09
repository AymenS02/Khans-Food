import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khans Food",
  description: "Khans Food Catering",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
        />

        <main className="flex-1 mt-48">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
