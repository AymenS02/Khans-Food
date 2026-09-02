import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-foreground text-background">
      {/* =========================================
          MAIN FOOTER
      ========================================= */}

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_0.9fr] lg:gap-16">
          {/* =====================================
              BRAND
          ===================================== */}

          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
              Catering • Pickup • Events
            </p>

            <Link
              href="/"
              className="mt-4 inline-block font-rye text-3xl text-background transition hover:text-primary sm:text-4xl"
            >
              Khans Food
            </Link>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-14 bg-background/20" />

              <span className="text-xs text-primary">
                ◆
              </span>

              <div className="h-px w-14 bg-background/20" />
            </div>

            <p className="max-w-md font-sans text-sm leading-6 text-background/55 sm:text-base sm:leading-7">
              Fresh food made for
              pickup, celebrations,
              office lunches, and
              gatherings worth
              remembering.
            </p>

            <Link
              href="/catering"
              className="group mt-7 flex min-h-12 w-full max-w-xs items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
            >
              Plan Catering

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* =====================================
              NAVIGATION
          ===================================== */}

          <div className="border-t border-background/15 pt-7 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
              Navigate
            </p>

            <ul className="mt-6 space-y-1">
              {footerLinks.map(
                (
                  link,
                  index
                ) => (
                  <li
                    key={
                      link.href
                    }
                  >
                    <Link
                      href={
                        link.href
                      }
                      className="group flex items-center gap-4 border-b border-background/10 py-3 font-sans text-sm text-background/65 transition hover:text-background"
                    >
                      <span className="w-5 font-sans text-[9px] text-primary">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span>
                        {
                          link.label
                        }
                      </span>

                      <span className="ml-auto text-background/25 transition group-hover:translate-x-1 group-hover:text-primary">
                        →
                      </span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* =====================================
              HELP
          ===================================== */}

          <div className="border-t border-background/15 pt-7 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
              Need Help?
            </p>

            <h2 className="mt-5 font-rye text-2xl leading-tight text-background">
              Questions About
              Your Feast?
            </h2>

            <p className="mt-4 max-w-sm font-sans text-sm leading-6 text-background/50">
              Find answers about
              pickup times, catering
              requests, approvals,
              payments, and orders.
            </p>

            <div className="mt-7 space-y-4">
              <Link
                href="/faq"
                className="group flex items-center justify-between border-b border-background/15 pb-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-background transition hover:text-primary"
              >
                Read FAQ

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/contact"
                className="group flex items-center justify-between border-b border-background/15 pb-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-background transition hover:text-primary"
              >
                Contact Us

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          MOTTO
      ========================================= */}

      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <p className="text-center font-rye text-xl text-background/90 sm:text-2xl lg:text-3xl">
            Your Event.{" "}
            <span className="text-primary">
              Our Feast.
            </span>
          </p>
        </div>
      </div>

      {/* =========================================
          COPYRIGHT
      ========================================= */}

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 font-sans text-[10px] uppercase tracking-[0.14em] text-background/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            Khans Food. All rights
            reserved.
          </p>

          <p>
            Made for good food &
            good company.
          </p>
        </div>
      </div>
    </footer>
  );
}