import Link from "next/link";

const adminFunctions = [
  {
    name: "Menu Orders",
    description:
      "View and manage customer pickup orders.",
    path: "/admin/orders",
  },

  {
    name: "Menu Items",
    description:
      "Create, edit, hide, and manage menu items.",
    path: "/admin/menu/items",
  },

  {
    name: "Menu Categories",
    description:
      "Create and manage menu categories.",
    path: "/admin/menu/categories",
  },

  {
    name: "Catering Requests",
    description:
      "Review, quote, approve, and reject catering requests.",
    path: "/admin/catering",
  },

  {
    name: "Catering Items",
    description:
      "Manage items available for custom catering and packages.",
    path: "/admin/catering/items",
  },

  {
    name: "Catering Packages",
    description:
      "Create and manage customer-facing catering packages.",
    path: "/admin/catering/packages",
  },

  {
    name: "Business Settings",
    description:
      "Manage business hours and ordering settings.",
    path: "/admin/settings",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="p-6 sm:p-8">
      {/* Header */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-foreground/60">
          Manage orders, menu offerings,
          catering, and business settings.
        </p>
      </div>

      {/* Admin Functions */}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">
          What would you like to do?
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminFunctions.map(
            (item) => (
              <Link
                key={item.path}
                href={item.path}
                className="
                  group
                  rounded-2xl
                  border
                  border-black/10
                  bg-white
                  p-6
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:shadow-md
                "
              >
                <h3 className="text-lg font-bold text-foreground transition group-hover:text-primary">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-foreground/60">
                  {
                    item.description
                  }
                </p>

                <p className="mt-5 text-sm font-semibold text-primary">
                  Open →
                </p>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Analytics */}

      <section className="mt-12 rounded-2xl border border-dashed border-black/10 bg-white p-6">
        <h2 className="text-xl font-bold text-foreground">
          Analytics
        </h2>

        <p className="mt-2 text-sm text-foreground/50">
          Coming soon — revenue, order
          volume, popular items, catering
          performance, and customer
          insights.
        </p>
      </section>
    </main>
  );
}