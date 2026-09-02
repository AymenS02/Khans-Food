import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="max-w-4xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Checkout
          </p>

          <h1 className="mt-4 max-w-3xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Payment Was
            <br className="hidden sm:block" />{" "}
            Canceled.
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            No charge was made. Your
            order is still available,
            and you can return to payment
            whenever you&apos;re ready.
          </p>
        </div>
      </section>

      {/* =========================================
          STATUS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* =====================================
              MESSAGE
          ===================================== */}

          <section className="border-y border-foreground/15 py-8 sm:py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30 font-rye text-xl text-primary">
                !
              </div>

              <div className="flex-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Order Still Available
                </p>

                <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
                  Nothing Was Charged.
                </h2>

                <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-foreground/55 sm:text-base">
                  Your checkout was
                  canceled before payment
                  was completed. You can
                  return to payment or go
                  back to your cart if
                  you want to make changes.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/checkout/payment"
                    className="group flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[220px]"
                  >
                    Return to Payment

                    <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/cart"
                    className="group flex min-h-12 w-full items-center justify-between border border-foreground/20 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:bg-foreground hover:text-background sm:w-auto sm:min-w-[190px]"
                  >
                    Back to Cart

                    <span className="ml-5 transition-transform group-hover:-translate-x-1">
                      ←
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              SUMMARY NOTE
          ===================================== */}

          <aside className="h-fit bg-foreground text-background lg:sticky lg:top-28">
            <div className="p-6 sm:p-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Checkout Status
              </p>

              <h2 className="mt-3 font-rye text-3xl">
                Payment Canceled
              </h2>

              <div className="my-6 h-px bg-background/15" />

              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Charge Status
                </p>

                <p className="mt-2 font-sans text-sm font-semibold">
                  No charge made
                </p>
              </div>

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Your Order
                </p>

                <p className="mt-2 font-sans text-sm leading-6 text-background/55">
                  Your order is still
                  available so you can
                  continue checkout
                  without starting over.
                </p>
              </div>

              <div className="mt-7 border-t border-background/15 pt-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-background/20 font-sans text-[10px]">
                    ✓
                  </span>

                  <p className="font-sans text-xs leading-5 text-background/45">
                    You can safely return
                    to payment when
                    you&apos;re ready.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}