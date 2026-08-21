import CategoryCreateForm from "@/features/menu/components/admin/CategoryCreateForm";

import { getAdminCategories } from "@/actions/menu/getAdminCategories";

export default async function AdminCategoriesPage() {
  const categories =
    await getAdminCategories();

  return (
    <main className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
          Menu Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-foreground">
          Categories
        </h1>

        <p className="mt-2 text-foreground/60">
          Organize menu items into
          categories customers can
          browse.
        </p>
      </div>

      {/* Create */}

      <CategoryCreateForm />

      {/* Existing Categories */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">
            Existing Categories
          </h2>

          <span className="text-sm text-foreground/50">
            {
              categories.length
            }{" "}
            total
          </span>
        </div>

        {categories.length ===
        0 ? (
          <div className="mt-6 rounded-xl bg-background p-6 text-center">
            <p className="text-foreground/60">
              No categories have
              been created yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
            <div className="grid grid-cols-2 bg-background px-4 py-3 text-sm font-semibold text-foreground/60">
              <span>
                Name
              </span>

              <span>
                Slug
              </span>
            </div>

            {categories.map(
              (category) => (
                <div
                  key={
                    category.id
                  }
                  className="grid grid-cols-2 border-t border-black/10 px-4 py-4"
                >
                  <span className="font-semibold">
                    {
                      category.name
                    }
                  </span>

                  <span className="font-mono text-sm text-foreground/60">
                    {
                      category.slug
                    }
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}