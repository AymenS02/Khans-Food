import Link from "next/link";

import { getPublicBusinessSettings } from "@/features/business/services/getPublicBusinessSettings";

export default async function ContactPage() {
  const business = await getPublicBusinessSettings();

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Khans Food</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Contact Us</h1>
        <p className="mt-4 text-lg leading-8 text-foreground/60">
          We can help with pickup questions, catering planning, and order support.
        </p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Pickup Orders</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            For order timing and menu questions, place your pickup order and add notes at checkout.
          </p>
          <Link href="/menu" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Browse Menu →
          </Link>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Catering Requests</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            Compare packages or build a custom request, then track review and payment status online.
          </p>
          <Link href="/catering" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Start Catering →
          </Link>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Business Hours</h2>
          <p className="mt-2 text-sm text-foreground/50">Today</p>
          <p className="mt-1 font-semibold">
            {capitalizeDay(business.today.day)}: {formatHours(business.today.isOpen, business.today.openingTime, business.today.closingTime)}
          </p>
          <p className="mt-3 text-xs leading-5 text-foreground/50">
            Same-day ordering cutoff: {formatTime(business.sameDayCutoffTime)}
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold">Need help right now?</h2>
        <p className="mt-3 text-sm leading-7 text-foreground/60">
          For the fastest support, use your account pages to view order details and payment status, or review our FAQ.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/account/orders"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            View My Orders
          </Link>
          <Link
            href="/faq"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-3 font-semibold text-foreground transition hover:bg-background"
          >
            Read FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}

function formatHours(isOpen: boolean, openingTime: string, closingTime: string) {
  if (!isOpen) {
    return "Closed";
  }

  return `${formatTime(openingTime)} – ${formatTime(closingTime)}`;
}

function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(Date.UTC(2025, 0, 1, hour, minute)));
}

function capitalizeDay(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
