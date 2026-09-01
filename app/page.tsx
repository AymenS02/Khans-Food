import Image from "next/image";
import Link from "next/link";

import { getMenuItems } from "@/features/menu/actions/getMenuItems";
import { getPublicCateringCatalog } from "@/features/catering/services/getPublicCateringCatalog";
import { getPublicBusinessSettings } from "@/features/business/services/getPublicBusinessSettings";
import { formatPrice } from "@/lib/utils/formatPrice";

export default async function HomePage() {
  const [menuItems, cateringCatalog, business] = await Promise.all([
    getMenuItems(),
    getPublicCateringCatalog(),
    getPublicBusinessSettings(),
  ]);

  const featuredMenu = menuItems.slice(0, 3);
  const featuredPackages = cateringCatalog.packages.slice(0, 3);
  const heroImage =
    featuredMenu.find((item) => item.image)?.image ??
    featuredPackages.find((item) => item.image)?.image;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
      <section className="overflow-hidden rounded-3xl bg-foreground text-white shadow-xl">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {business.businessName}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Fresh pickup meals and trusted catering for every gathering.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Order today&apos;s favorites for pickup or book catering packages built for teams,
              family events, and celebrations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Order Pickup
              </Link>
              <Link
                href="/catering"
                className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Catering
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70">Today&apos;s hours</p>
              <p className="mt-2 text-xl font-bold">
                {capitalizeDay(business.today.day)}: {formatHours(business.today.isOpen, business.today.openingTime, business.today.closingTime)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/70">Same-day ordering</p>
              <p className="mt-2 text-base font-semibold">
                Cutoff at {formatTime(business.sameDayCutoffTime)} ({business.timezone.replace("_", " ")})
              </p>
              <p className="mt-2 text-sm text-white/80">
                {business.sameDayOrderingAvailable
                  ? "Pickup ordering is currently open for today."
                  : "Same-day pickup ordering is currently unavailable."}
              </p>
            </div>
          </div>
        </div>

        {heroImage ? (
          <div className="relative h-56 w-full sm:h-72">
            <Image
              src={heroImage}
              alt="Featured Khans Food selection"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          </div>
        ) : null}
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Menu</p>
            <h2 className="mt-2 text-3xl font-bold">Featured Picks</h2>
          </div>
          <Link href="/menu" className="font-semibold text-primary hover:underline">
            View full menu →
          </Link>
        </div>

        {featuredMenu.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-foreground/60">Featured menu items are coming soon.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {featuredMenu.map((item) => (
              <article key={item._id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-background">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-foreground/40">Image unavailable</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  {item.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/60">{item.description}</p>
                  ) : null}
                  <p className="mt-4 font-semibold text-primary">{formatPrice(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Catering</p>
            <h2 className="mt-2 text-3xl font-bold">Package Preview</h2>
          </div>
          <Link href="/catering" className="font-semibold text-primary hover:underline">
            Browse packages →
          </Link>
        </div>

        {featuredPackages.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-foreground/60">No catering packages are currently available.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {featuredPackages.map((pkg) => (
              <article key={pkg.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                {pkg.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/60">{pkg.description}</p>
                ) : null}
                <p className="mt-4 font-semibold text-primary">
                  {formatPrice(pkg.price)} {pkg.pricingType === "per_person" ? <span className="text-sm text-foreground/50">/ person</span> : null}
                </p>
                <Link
                  href={`/catering/${pkg.slug}`}
                  className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
                >
                  View Package
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 rounded-3xl bg-white p-7 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">How it Works</p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <article>
            <h3 className="text-lg font-bold">1. Choose your order</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/60">Browse the menu for pickup or select a catering package for your event.</p>
          </article>
          <article>
            <h3 className="text-lg font-bold">2. Schedule confidently</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/60">Pick a date and time during open business hours and before same-day cutoff.</p>
          </article>
          <article>
            <h3 className="text-lg font-bold">3. Receive confirmation</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/60">Track orders in your account and complete catering payment only after approval.</p>
          </article>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Freshly Prepared</h3>
          <p className="mt-2 text-sm leading-6 text-foreground/60">Made-to-order dishes with consistent quality for both daily pickup and events.</p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Reliable Pickup Windows</h3>
          <p className="mt-2 text-sm leading-6 text-foreground/60">Live availability follows your selected date and current ordering cutoff logic.</p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Secure Checkout Flow</h3>
          <p className="mt-2 text-sm leading-6 text-foreground/60">Order totals and payment completion are enforced server-side for consistency.</p>
        </article>
      </section>

      <section className="mt-14 rounded-3xl bg-primary p-8 text-white sm:p-10">
        <h2 className="text-3xl font-bold">Ready to order from Khans Food?</h2>
        <p className="mt-3 max-w-2xl text-white/90">Place a pickup order in minutes or start your catering request today.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/menu" className="rounded-xl bg-white px-6 py-3 font-semibold text-foreground">
            Start Pickup Order
          </Link>
          <Link href="/contact" className="rounded-xl border border-white/50 px-6 py-3 font-semibold text-white hover:bg-white/10">
            Contact Khans Food
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
