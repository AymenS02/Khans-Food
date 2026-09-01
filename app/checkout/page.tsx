import CheckoutForm from "@/features/checkout/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Checkout</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Complete your order</h1>
        <p className="mt-2 text-sm text-foreground/60 sm:text-base">
          Enter your contact and pickup details, then continue to secure payment.
        </p>
      </div>

      <div className="mt-8">
        <CheckoutForm />
      </div>
    </main>
  );
}