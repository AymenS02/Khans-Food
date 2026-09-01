import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Checkout</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Payment Was Canceled</h1>
        <p className="mt-4 text-sm leading-7 text-foreground/60 sm:text-base">
          No charge was made. Your order is still available, and you can return to payment when you&apos;re ready.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/checkout/payment"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Return to Payment
          </Link>
          <Link
            href="/cart"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-3 font-semibold text-foreground transition hover:bg-background"
          >
            Back to Cart
          </Link>
        </div>
      </section>
    </main>
  );
}
