import CheckoutForm from "@/features/checkout/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="bg-background px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">

        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Khans Food
          </p>

          <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-5 text-lg leading-8 text-foreground/60">
            Enter your information and choose your pickup time.
          </p>
        </div>

        <div className="mt-10">
          <CheckoutForm />
        </div>

      </div>
    </main>
  );
}