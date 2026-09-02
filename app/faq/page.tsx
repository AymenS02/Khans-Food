import Link from "next/link";

const faqs = [
  {
    question: "How does pickup ordering work?",
    answer:
      "Browse the menu, add items to cart, and complete checkout with your pickup date and time. You'll see your order details in your account when signed in.",
  },
  {
    question: "Can I place a same-day pickup order?",
    answer:
      "Yes, if same-day ordering is still open for the day and pickup times are available during business hours.",
  },
  {
    question: "How is pickup scheduling handled?",
    answer:
      "Pickup times are offered based on business hours and current availability for the selected date.",
  },
  {
    question: "Is there an order cutoff time?",
    answer:
      "Yes. Same-day pickup is limited by the configured cutoff time, and unavailable times are filtered out at checkout.",
  },
  {
    question: "Can I modify or cancel an order?",
    answer:
      "For help with order changes, contact Khans Food directly using the contact page so the team can review your order status.",
  },
  {
    question: "When is payment collected?",
    answer:
      "Menu pickup orders are paid during checkout. Catering payment is collected only after a catering request is reviewed and approved.",
  },
  {
    question: "What catering packages are available?",
    answer:
      "Visit the Catering page to see currently available packages and submit a package request from the package detail page.",
  },
  {
    question: "Can I request custom catering?",
    answer:
      "Yes. Use the custom catering flow to build a request from available catering items.",
  },
  {
    question: "How does catering approval and quoting work?",
    answer:
      "After submission, your catering request is reviewed by Khans Food. Approved requests receive an official quote and an order for payment.",
  },
  {
    question: "How is catering payment completed?",
    answer:
      "Once approved, pay from your account's catering order page. Payment completion is confirmed through the secure payment flow.",
  },
  {
    question: "Can guests pay for approved catering requests?",
    answer:
      "Yes. Approved guest requests can be paid through the dedicated guest catering payment link provided for that request.",
  },
  {
    question: "Do you support allergens or special requests?",
    answer:
      "You can add notes with your order or catering request. Khans Food will review details and follow up when clarification is needed.",
  },
  {
    question: "How can I contact Khans Food?",
    answer:
      "Use the contact page for pickup and catering questions, including order support and event planning.",
  },
];

export default function FaqPage() {
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
            Frequently Asked
            <br className="hidden sm:block" />{" "}
            Questions.
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            Quick answers about pickup
            orders, catering requests,
            approvals, payment, and
            everything in between.
          </p>
        </div>
      </section>

      {/* =========================================
          FAQS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="h-fit lg:sticky lg:top-28">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Help Centre
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground">
              Need an Answer?
            </h2>

            <p className="mt-4 font-sans text-sm leading-6 text-foreground/50">
              Browse the questions or
              contact us directly if
              you need more help with
              your order or event.
            </p>

            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:text-primary"
            >
              Contact Us

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </aside>

          {/* =====================================
              QUESTIONS
          ===================================== */}

          <div className="border-t border-foreground/15">
            {faqs.map(
              (item, index) => (
                <details
                  key={item.question}
                  className="group border-b border-foreground/15"
                  name="faq"
                >
                  <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:gap-6 sm:py-6">
                    <span className="shrink-0 font-sans text-[10px] font-bold text-primary">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span className="flex-1 font-rye text-lg leading-snug text-foreground sm:text-xl">
                      {item.question}
                    </span>

                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center border border-foreground/20 font-sans text-lg text-primary transition duration-300 group-open:rotate-45 group-open:bg-foreground group-open:text-background"
                    >
                      +
                    </span>
                  </summary>

                  <div className="grid grid-cols-[26px_1fr_auto] gap-4 pb-6 sm:grid-cols-[30px_1fr_36px] sm:gap-6 sm:pb-7">
                    <div />

                    <p className="max-w-3xl font-sans text-sm leading-7 text-foreground/60 sm:text-base">
                      {item.answer}
                    </p>

                    <div />
                  </div>
                </details>
              )
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Still Need Help?
            </p>

            <h2 className="mt-4 max-w-3xl font-rye text-3xl leading-tight sm:text-4xl lg:text-5xl">
              We&apos;re Happy to
              Help With Your Order or
              Event.
            </h2>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-14 bg-background/20" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="max-w-xl font-sans text-sm leading-6 text-background/55 sm:text-base">
              Reach out for help with
              pickup timing, catering
              requests, account
              questions, or payment.
            </p>
          </div>

          <Link
            href="/contact"
            className="group flex min-h-12 w-full items-center justify-between bg-primary px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[220px]"
          >
            Contact Khans Food

            <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}