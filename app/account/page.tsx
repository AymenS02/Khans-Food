import Link from "next/link";

import { auth } from "@/auth";

const accountLinks = [
  {
    title: "My Orders",
    description: "View order history, status, and pickup details.",
    href: "/account/orders",
    cta: "View Orders",
  },
  {
    title: "Catering Requests",
    description: "Track submitted, reviewed, and approved catering requests.",
    href: "/account/catering",
    cta: "View Requests",
  },
  {
    title: "Order Again",
    description: "Browse the latest menu and place a pickup order.",
    href: "/menu",
    cta: "Browse Menu",
  },
  {
    title: "Explore Catering",
    description: "See available packages and start a new request.",
    href: "/catering",
    cta: "Browse Catering",
  },
];

export default async function AccountPage() {
  const session = await auth();

  const displayName = session?.user?.name ?? "Customer";
  const email = session?.user?.email ?? "";

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <header className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">My Account</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Welcome back, {displayName}</h1>
        {email ? <p className="mt-2 text-sm text-foreground/60">Signed in as {email}</p> : null}
      </header>

      <section className="mt-8 grid gap-5 sm:grid-cols-2">
        {accountLinks.map((link) => (
          <article key={link.href} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">{link.title}</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/60">{link.description}</p>
            <Link href={link.href} className="mt-5 inline-block font-semibold text-primary hover:underline">
              {link.cta} →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
