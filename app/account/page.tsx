import Link from "next/link";

import { auth } from "@/auth";

const accountLinks = [
  {
    number: "01",
    title: "My Orders",
    description:
      "View your order history, current status, and pickup details.",
    href: "/account/orders",
    cta: "View Orders",
  },
  {
    number: "02",
    title: "Catering Requests",
    description:
      "Track submitted, reviewed, and approved catering requests.",
    href: "/account/catering",
    cta: "View Requests",
  },
  {
    number: "03",
    title: "Order Again",
    description:
      "Browse the latest menu and place another pickup order.",
    href: "/menu",
    cta: "Browse Menu",
  },
  {
    number: "04",
    title: "Explore Catering",
    description:
      "Browse catering packages or start a new custom request.",
    href: "/catering",
    cta: "Browse Catering",
  },
];

export default async function AccountPage() {
  const session = await auth();

  const displayName =
    session?.user?.name ??
    "Customer";

  const email =
    session?.user?.email ??
    "";

  return (
    <main className="overflow-hidden">
      {/* =========================================
          ACCOUNT HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-10 border-b border-foreground/15 pb-14 sm:pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              My Account
            </p>

            <h1 className="mt-4 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Welcome Back,
              <br className="hidden sm:block" />{" "}
              {displayName}.
            </h1>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px w-16 bg-foreground/25" />

              <span className="text-xs text-primary">
                ◆
              </span>

              <div className="h-px w-16 bg-foreground/25" />
            </div>

            <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
              Manage your orders,
              catering requests, and
              start something new from
              here.
            </p>
          </div>

          {email && (
            <div className="lg:text-right">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                Signed In As
              </p>

              <p className="mt-2 break-all font-sans text-sm font-semibold text-foreground sm:break-normal">
                {email}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          ACCOUNT ACTIONS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid border-t border-foreground/15 sm:grid-cols-2">
          {accountLinks.map(
            (link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex min-h-[250px] flex-col border-b border-foreground/15 py-8 transition hover:bg-foreground/[0.025] sm:min-h-[290px] sm:p-8 ${
                  index % 2 === 0
                    ? "sm:border-r"
                    : ""
                }`}
              >
                {/* NUMBER */}

                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-primary">
                    {link.number}
                  </span>

                  <span className="text-lg text-foreground/30 transition duration-300 group-hover:translate-x-1 group-hover:text-primary">
                    →
                  </span>
                </div>

                {/* CONTENT */}

                <div className="mt-auto pt-12">
                  <span className="mb-4 block text-xs text-primary">
                    ◆
                  </span>

                  <h2 className="font-rye text-2xl leading-tight text-foreground sm:text-3xl">
                    {link.title}
                  </h2>

                  <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-foreground/55">
                    {link.description}
                  </p>

                  <p className="mt-6 inline-flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-foreground transition group-hover:text-primary">
                    {link.cta}

                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* =========================================
          QUICK CTA
      ========================================= */}

      <section className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 sm:py-16 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Hungry Again?
            </p>

            <h2 className="mt-3 font-rye text-3xl sm:text-4xl">
              Your Next Feast Is
              Waiting.
            </h2>
          </div>

          <Link
            href="/menu"
            className="inline-flex min-h-12 w-full items-center justify-between bg-primary px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[210px]"
          >
            Browse Menu

            <span className="ml-5 text-lg">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}