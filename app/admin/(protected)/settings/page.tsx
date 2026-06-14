import { requireAdmin } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const adminUser = await requireAdmin();

  return (
    <section className="surface-card px-6 py-8 sm:px-8">
      <span className="eyebrow">Settings</span>
      <h1 className="mt-5 text-4xl font-semibold">Admin Settings</h1>
      <p className="mt-4 text-base leading-8 text-muted-foreground">
        Role administration, preferences, and branch policies will expand in a later module.
      </p>
      <p className="mt-6 text-sm font-medium text-primary">Current role access: {adminUser.role}</p>
      <p className="mt-2 text-sm text-muted-foreground">Coming in later module.</p>
    </section>
  );
}
