import Link from "next/link";

import { getPublicCateringItems } from "@/features/catering/services/getPublicCateringItems";

import CustomCateringBuilder from "@/features/catering/components/CustomCateringBuilder";

export default async function CustomCateringPage() {
  const items =
    await getPublicCateringItems();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <Link
        href="/catering"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Catering
      </Link>

      <div className="mt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Custom Catering
        </p>

        <h1 className="mt-2 text-4xl font-bold text-foreground">
          Build Your Catering
        </h1>

        <p className="mt-4 max-w-2xl text-foreground/60">
          Select the items you would like
          for your event and customize the
          quantities.
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