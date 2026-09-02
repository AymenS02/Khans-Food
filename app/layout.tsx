import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/auth";

import { Rye } from "next/font/google";

export const metadata: Metadata = {
  title: "Khans Food",
  description: "Khans Food Catering",
};

const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rye",
  display: "swap",
});

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
      className="antialiased"
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground {rye.variable}">
        <Navbar
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
        />

        <main className="mt-24 flex-1 sm:mt-28">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
