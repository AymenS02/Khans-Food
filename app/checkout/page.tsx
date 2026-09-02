import CheckoutForm from "@/features/checkout/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="border-b border-foreground/15 pb-12 sm:pb-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Checkout
          </p>

          <h1 className="mt-4 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Complete Your
            <br className="hidden sm:block" />{" "}
            Order.
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            Enter your contact and
            pickup details below, then
            continue to secure payment
            to confirm your order.
          </p>
        </div>
      </section>

      {/* =========================================
          CHECKOUT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        {/* =====================================
            CHECKOUT INTRO
        ===================================== */}

        <div className="mb-10 grid gap-6 border-b border-foreground/15 pb-8 sm:grid-cols-3 sm:gap-8">
          <CheckoutStep
            number="01"
            title="Details"
            description="Tell us who the order is for."
          />

          <CheckoutStep
            number="02"
            title="Pickup"
            description="Choose when you want to pick it up."
          />

          <CheckoutStep
            number="03"
            title="Payment"
            description="Complete secure payment through Stripe."
          />
        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <CheckoutForm />
      </section>
    </main>
  );
}

/* =============================================
   CHECKOUT STEP
============================================= */

function CheckoutStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 sm:block">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 font-sans text-[10px] font-bold text-primary">
        {number}
      </span>

      <div className="sm:mt-4">
        <p className="font-rye text-lg text-foreground sm:text-xl">
          {title}
        </p>

        <p className="mt-1 max-w-xs font-sans text-xs leading-5 text-foreground/45 sm:text-sm sm:leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}