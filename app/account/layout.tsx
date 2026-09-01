import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "customer") {
    redirect(session.user.role === "admin" ? "/admin" : "/");
  }

  return <>{children}</>;
}
