import Image from "next/image";
import Link from "next/link";

import HeroImages from "@/components/HeroImages";

import { getMenuItems } from "@/features/menu/actions/getMenuItems";
import { getPublicCateringCatalog } from "@/features/catering/services/getPublicCateringCatalog";
import { getPublicBusinessSettings } from "@/features/business/services/getPublicBusinessSettings";

export default async function HomePage() {
  const [
    menuItems,
    cateringCatalog,
    business,
  ] = await Promise.all([
    getMenuItems(),
    getPublicCateringCatalog(),
    getPublicBusinessSettings(),
  ]);

  const featuredMenu =
    menuItems.slice(0, 3);

  const featuredPackages =
    cateringCatalog.packages.slice(
      0,
      3
    );

  return (
    <main className="relative overflow-hidden">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* MOBILE */}

        <div className="flex min-h-[78vh] flex-col items-center justify-center py-12 font-rye md:hidden">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.35em] text-primary">
            {business.businessName}
          </p>

          <h1 className="max-w-lg text-center text-4xl leading-[1.2] text-foreground sm:text-5xl">
            Catering Every Occasion
            with Flavour.
          </h1>

          <Divider />

          <p className="mb-8 max-w-md text-center font-sans text-sm leading-6 text-foreground/65">
            From family gatherings to
            unforgettable celebrations,
            we bring bold flavours and
            generous portions to every
            table.
          </p>

          <HeroImages variant="mobile" />

          <div className="mt-9 flex w-full max-w-sm flex-col gap-3 font-sans">
            <Link
              href="/catering"
              className="flex min-h-12 items-center justify-center rounded-sm bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-background transition hover:opacity-85"
            >
              Explore Catering
            </Link>

            <Link
              href="/menu"
              className="flex min-h-12 items-center justify-center rounded-sm border border-foreground/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition hover:bg-foreground hover:text-background"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* DESKTOP */}

        <div className="hidden min-h-[82vh] items-center justify-between gap-12 py-16 font-rye md:flex lg:gap-20">
          <div className="max-w-[610px]">
            <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              {business.businessName}
            </p>

            <h1 className="text-6xl leading-[1.08] text-foreground lg:text-7xl xl:text-8xl">
              Catering Every
              Occasion with Flavour.
            </h1>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px w-20 bg-foreground/35" />

              <span className="text-xs text-primary">
                ◆
              </span>

              <div className="h-px w-20 bg-foreground/35" />
            </div>

            <p className="max-w-lg font-sans text-base leading-7 text-foreground/65 lg:text-lg">
              From intimate dinners to
              large celebrations, we
              serve food made for
              gathering, sharing, and
              remembering.
            </p>

            <div className="mt-9 flex gap-4 font-sans">
              <Link
                href="/catering"
                className="inline-flex min-h-12 items-center justify-center bg-foreground px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-background transition hover:opacity-85"
              >
                Explore Catering
              </Link>

              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center border border-foreground/30 px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition hover:bg-foreground hover:text-background"
              >
                View Menu
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <HeroImages variant="desktop" />
          </div>
        </div>
      </section>

      {/* =========================================
          SMALL BRAND STATEMENT
      ========================================= */}

      <section className="border-y border-foreground/10 bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl divide-y divide-background/15 px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
          <Feature
            number="01"
            title="Made Fresh"
            description="Food prepared with care, flavour, and quality ingredients."
          />

          <Feature
            number="02"
            title="Made to Gather"
            description="Perfect for celebrations, family events, and special occasions."
          />

          <Feature
            number="03"
            title="Made Your Way"
            description="Choose a catering package or build a custom menu for your event."
          />
        </div>
      </section>

      {/* =========================================
          INTRO
      ========================================= */}

      <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Food worth gathering for
        </p>

        <h2 className="mx-auto mt-5 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Good food turns a gathering
          into an occasion.
        </h2>

        <Divider centered />

        <p className="mx-auto max-w-2xl font-sans text-base leading-7 text-foreground/60 sm:text-lg">
          Whether you&apos;re feeding a
          few friends or a room full of
          guests, Khans Food brings
          generous portions, comforting
          favourites, and bold flavour
          to the table.
        </p>
      </section>

      {/* =========================================
          FEATURED MENU
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
        <SectionHeading
          eyebrow="From our kitchen"
          title="Crowd Favourites"
          href="/menu"
          linkLabel="See Full Menu"
        />

        {featuredMenu.length > 0 ? (
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {featuredMenu.map(
              (item, index) => (
                <article
                  key={item.id}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-sans text-sm text-foreground/40">
                        No image
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center bg-background font-sans text-xs font-semibold text-foreground">
                      0{index + 1}
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex items-start justify-between gap-5">
                      <h3 className="font-rye text-2xl text-foreground">
                        {item.name}
                      </h3>

                      <p className="shrink-0 font-sans text-sm font-bold text-primary">
                        $
                        {item.price.toFixed(
                          2
                        )}
                      </p>
                    </div>

                    {item.description && (
                      <p className="mt-2 line-clamp-2 font-sans text-sm leading-6 text-foreground/55">
                        {
                          item.description
                        }
                      </p>
                    )}

                    <div className="mt-5 h-px w-full bg-foreground/10" />
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <p className="mt-10 font-sans text-foreground/60">
            Menu items are coming soon.
          </p>
        )}
      </section>

      {/* =========================================
          CATERING STATEMENT
      ========================================= */}

      <section className="relative bg-foreground px-5 py-24 text-background sm:px-8 sm:py-32">
        <div className="absolute inset-0 opacity-[0.035]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:22px_22px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Catering by Khans
            </p>

            <h2 className="mt-5 max-w-xl font-rye text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Your Event.
              <br />
              Our Feast.
            </h2>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px w-20 bg-background/25" />
              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="max-w-lg font-sans text-base leading-7 text-background/65">
              Weddings, family
              gatherings, celebrations,
              work events, and
              everything in between.
              Choose one of our
              packages or create a menu
              that fits your occasion.
            </p>

            <Link
              href="/catering"
              className="mt-8 inline-flex min-h-12 items-center justify-center bg-primary px-7 py-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-85"
            >
              Start Your Catering
              Request
              <span className="ml-3">
                →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden border border-background/15 bg-background/15">
            <Occasion
              title="Weddings"
              number="01"
            />

            <Occasion
              title="Family Gatherings"
              number="02"
            />

            <Occasion
              title="Corporate Events"
              number="03"
            />

            <Occasion
              title="Celebrations"
              number="04"
            />
          </div>
        </div>
      </section>

      {/* =========================================
          CATERING PACKAGES
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <SectionHeading
          eyebrow="Catering packages"
          title="Built for the Whole Table"
          href="/catering"
          linkLabel="View All Packages"
        />

        {featuredPackages.length >
        0 ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {featuredPackages.map(
              (packageItem) => (
                <Link
                  key={
                    packageItem.slug
                  }
                  href={`/catering/${packageItem.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-foreground/5">
                    {packageItem.image ? (
                      <Image
                        src={
                          packageItem.image
                        }
                        alt={
                          packageItem.name
                        }
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-sans text-sm text-foreground/40">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="border-x border-b border-foreground/10 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-rye text-2xl">
                        {
                          packageItem.name
                        }
                      </h3>

                      <span className="text-xl text-primary transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>

                    {packageItem.description && (
                      <p className="mt-3 line-clamp-3 font-sans text-sm leading-6 text-foreground/55">
                        {
                          packageItem.description
                        }
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2 font-sans text-xs">
                      <span className="border border-foreground/15 px-3 py-2">
                        Min.{" "}
                        {
                          packageItem.minimumGuests
                        }{" "}
                        guests
                      </span>

                      {packageItem.maximumGuests && (
                        <span className="border border-foreground/15 px-3 py-2">
                          Up to{" "}
                          {
                            packageItem.maximumGuests
                          }{" "}
                          guests
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        ) : (
          <p className="mt-10 font-sans text-foreground/60">
            Catering packages are
            coming soon.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/catering/custom"
            className="group inline-flex items-center gap-4 font-sans text-sm font-semibold uppercase tracking-[0.14em]"
          >
            Or Build a Custom Catering
            Request
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section className="border-y border-foreground/10 bg-foreground/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
          <div className="text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Simple from start to
              finish
            </p>

            <h2 className="mt-4 font-rye text-4xl sm:text-5xl">
              How Catering Works
            </h2>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-4 md:gap-4">
            <ProcessStep
              number="01"
              title="Choose"
              description="Pick a catering package or build your own custom menu."
            />

            <ProcessStep
              number="02"
              title="Request"
              description="Tell us about your event, date, guest count, and preferences."
            />

            <ProcessStep
              number="03"
              title="Confirm"
              description="We review the request and confirm your catering details."
            />

            <ProcessStep
              number="04"
              title="Feast"
              description="Your order is prepared for your event and ready for pickup."
            />
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="relative overflow-hidden bg-primary px-6 py-16 text-center text-white sm:px-10 sm:py-20">
          <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full border border-white/10" />

          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              Bring everyone to the
              table
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl font-rye text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Make Your Next Gathering
              a Feast.
            </h2>

            <div className="mx-auto my-7 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-white/40" />

              <span className="text-xs">
                ◆
              </span>

              <div className="h-px w-16 bg-white/40" />
            </div>

            <p className="mx-auto max-w-xl font-sans text-base leading-7 text-white/75">
              Tell us what you&apos;re
              planning and we&apos;ll
              help you put together the
              food.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 font-sans sm:flex-row">
              <Link
                href="/catering"
                className="inline-flex min-h-12 items-center justify-center bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary transition hover:bg-white/90"
              >
                Explore Catering
              </Link>

              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center border border-white/40 px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-primary"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================
   SMALL COMPONENTS
============================================= */

function Divider({
  centered = false,
}: {
  centered?: boolean;
}) {
  return (
    <div
      className={`my-7 flex items-center gap-3 ${
        centered
          ? "justify-center"
          : ""
      }`}
    >
      <div className="h-px w-16 bg-foreground/30" />

      <span className="text-xs text-primary">
        ◆
      </span>

      <div className="h-px w-16 bg-foreground/30" />
    </div>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="px-4 py-10 sm:px-7">
      <p className="font-sans text-xs font-semibold text-primary">
        {number}
      </p>

      <h3 className="mt-3 font-rye text-xl">
        {title}
      </h3>

      <p className="mt-2 max-w-xs font-sans text-sm leading-6 text-background/55">
        {description}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-foreground/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </p>

        <h2 className="mt-3 font-rye text-4xl sm:text-5xl">
          {title}
        </h2>
      </div>

      <Link
        href={href}
        className="group inline-flex items-center gap-3 self-start font-sans text-sm font-semibold uppercase tracking-[0.12em] sm:self-auto"
      >
        {linkLabel}

        <span className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}

function Occasion({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="min-h-40 bg-foreground p-6 sm:min-h-48">
      <p className="font-sans text-xs text-primary">
        {number}
      </p>

      <div className="mt-12">
        <span className="mb-3 block text-primary">
          ◆
        </span>

        <h3 className="font-rye text-xl sm:text-2xl">
          {title}
        </h3>
      </div>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center md:px-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-foreground/20 font-sans text-xs font-bold text-primary">
        {number}
      </div>

      <h3 className="mt-5 font-rye text-2xl">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-xs font-sans text-sm leading-6 text-foreground/55">
        {description}
      </p>
    </div>
  );
}