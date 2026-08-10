import CheckoutForm from "@/features/checkout/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-4xl font-bold">
        Checkout
      </h1>

      <div className="mt-8">
        <CheckoutForm />
      </div>
    </main>
  );
}