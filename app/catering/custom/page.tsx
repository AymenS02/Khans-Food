import Link from "next/link";

import { getPublicCateringItems } from "@/features/catering/services/getPublicCateringItems";

import CustomCateringBuilder from "@/features/catering/components/CustomCateringBuilder";

export default async function CustomCateringPage() {
  const items =
    await getPublicCateringItems();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/catering"
        className="inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-semibold text-primary outline-none transition hover:underline focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        ← Back to Catering
      </Link>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Custom Catering
        </p>

        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Build Your Catering Request
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/60 sm:text-lg">
          Choose your food, set quantities, then provide event and contact details.
          Final pricing is confirmed after review.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-foreground/60">
            No custom catering items are
            currently available.
          </p>
        </div>
      ) : (
        <CustomCateringBuilder
          items={items}
        />
      )}
    </main>
  );
}