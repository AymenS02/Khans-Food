import CategoryCreateForm from "@/features/menu/components/admin/CategoryCreateForm";

import { getAdminCategories } from "@/actions/menu/getAdminCategories";

import CategoryRowActions from "@/features/menu/components/admin/CategoryRowActions";

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
            {/* Desktop headings */}

            <div className="hidden grid-cols-[1fr_1fr_2fr] gap-5 bg-background px-4 py-3 text-sm font-semibold text-foreground/60 md:grid">
              <span>
                Name
              </span>

              <span>
                Slug
              </span>

              <span>
                Actions
              </span>
            </div>

            {categories.map(
              (category) => (
                <div
                  key={
                    category.id
                  }
                  className="grid gap-4 border-t border-black/10 px-4 py-5 first:border-t-0 md:grid-cols-[1fr_1fr_2fr] md:items-start"
                >
                  {/* Name */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Name
                    </p>

                    <p className="mt-1 font-semibold md:mt-0">
                      {
                        category.name
                      }
                    </p>
                  </div>

                  {/* Slug */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Slug
                    </p>

                    <p className="mt-1 break-all font-mono text-sm text-foreground/60 md:mt-0">
                      {
                        category.slug
                      }
                    </p>
                  </div>

                  {/* Actions */}

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Actions
                    </p>

                    <CategoryRowActions
                      id={
                        category.id
                      }
                      name={
                        category.name
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}