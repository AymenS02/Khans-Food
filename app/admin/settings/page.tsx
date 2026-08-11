import { getBusinessSettings } from "@/actions/business/getBusinessSettings";

import BusinessSettingsForm from "@/features/business/components/BusinessSettingsForm";

interface AdminSettingsPageProps {
  searchParams: Promise<{
    saved?: string;
  }>;
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  const settings =
    await getBusinessSettings();

  const { saved } =
    await searchParams;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-bold text-foreground">
          Business Settings
        </h1>

        <p className="mt-3 text-foreground/60">
          Manage business hours and
          checkout availability.
        </p>
      </div>

      {saved === "1" && (
        <div
          role="status"
          className="mt-8 rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3"
        >
          <p className="font-medium text-secondary">
            Business settings saved.
          </p>
        </div>
      )}

      <BusinessSettingsForm
        settings={settings}
      />
    </main>
  );
}