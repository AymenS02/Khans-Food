import Link from "next/link";

import { getPublicBusinessSettings } from "@/features/business/services/getPublicBusinessSettings";

export default async function ContactPage() {
  const business =
    await getPublicBusinessSettings();

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="border-b border-foreground/15 pb-12 sm:pb-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Khans Food
          </p>

          <h1 className="mt-4 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            We&apos;re Here to
            <br className="hidden sm:block" />{" "}
            Help.
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            Whether you have a pickup
            question, need help with an
            order, or you&apos;re
            planning your next event,
            we&apos;ll point you in the
            right direction.
          </p>
        </div>
      </section>

      {/* =========================================
          CONTACT OPTIONS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid border-t border-foreground/15 md:grid-cols-3">
          {/* =====================================
              PICKUP
          ===================================== */}

          <Link
            href="/menu"
            className="group flex min-h-[270px] flex-col border-b border-foreground/15 py-8 transition hover:bg-foreground/[0.025] md:border-r md:px-7 md:py-10"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-primary">
                01
              </span>

              <span className="text-lg text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </div>

            <div className="mt-auto pt-14">
              <span className="mb-4 block text-xs text-primary">
                ◆
              </span>

              <h2 className="font-rye text-2xl text-foreground">
                Pickup Orders
              </h2>

              <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-foreground/55">
                Browse the menu, choose
                your pickup time, and
                add any order notes
                during checkout.
              </p>

              <p className="mt-6 font-sans text-xs font-bold uppercase tracking-[0.14em] transition group-hover:text-primary">
                Browse Menu →
              </p>
            </div>
          </Link>

          {/* =====================================
              CATERING
          ===================================== */}

          <Link
            href="/catering"
            className="group flex min-h-[270px] flex-col border-b border-foreground/15 py-8 transition hover:bg-foreground/[0.025] md:border-r md:px-7 md:py-10"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-primary">
                02
              </span>

              <span className="text-lg text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </div>

            <div className="mt-auto pt-14">
              <span className="mb-4 block text-xs text-primary">
                ◆
              </span>

              <h2 className="font-rye text-2xl text-foreground">
                Catering Requests
              </h2>

              <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-foreground/55">
                Explore catering
                packages or build a
                custom request for your
                event.
              </p>

              <p className="mt-6 font-sans text-xs font-bold uppercase tracking-[0.14em] transition group-hover:text-primary">
                Start Catering →
              </p>
            </div>
          </Link>

          {/* =====================================
              HOURS
          ===================================== */}

          <article className="flex min-h-[270px] flex-col border-b border-foreground/15 py-8 md:px-7 md:py-10">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-primary">
                03
              </span>

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <div className="mt-auto pt-14">
              <h2 className="font-rye text-2xl text-foreground">
                Today&apos;s Hours
              </h2>

              <p className="mt-4 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                {capitalizeDay(
                  business.today.day
                )}
              </p>

              <p className="mt-2 font-rye text-xl text-primary">
                {formatHours(
                  business.today
                    .isOpen,
                  business.today
                    .openingTime,
                  business.today
                    .closingTime
                )}
              </p>

              <div className="mt-5 border-t border-foreground/10 pt-4">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                  Same-Day Cutoff
                </p>

                <p className="mt-2 font-sans text-sm font-semibold">
                  {formatTime(
                    business.sameDayCutoffTime
                  )}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* =========================================
          HELP SECTION
      ========================================= */}

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Need Help Now?
            </p>

            <h2 className="mt-4 max-w-3xl font-rye text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Your Order Details Are
              Already at Your
              Fingertips.
            </h2>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-14 bg-background/20" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="max-w-xl font-sans text-sm leading-6 text-background/55 sm:text-base">
              Check your account for
              order status and payment
              details, or visit our FAQ
              for answers to common
              questions.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
            <Link
              href="/account/orders"
              className="group flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:min-w-[210px]"
            >
              View My Orders

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="/faq"
              className="group flex min-h-12 w-full items-center justify-between border border-background/25 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-background transition hover:bg-background hover:text-foreground sm:min-w-[210px]"
            >
              Read FAQ

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatHours(
  isOpen: boolean,
  openingTime: string,
  closingTime: string
) {
  if (!isOpen) {
    return "Closed";
  }

  return `${formatTime(
    openingTime
  )} – ${formatTime(
    closingTime
  )}`;
}

function formatTime(
  value: string
) {
  const [
    hour,
    minute,
  ] =
    value
      .split(":")
      .map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(
    new Date(
      Date.UTC(
        2025,
        0,
        1,
        hour,
        minute
      )
    )
  );
}

function capitalizeDay(
  value: string
) {
  return (
    value
      .charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}