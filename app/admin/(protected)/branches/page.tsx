import Link from "next/link";
import { UserRole } from "@prisma/client";
import { ExternalLink, PencilLine } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { RoleAccessNote } from "@/components/admin/role-access-note";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getBranchesForAdmin } from "@/lib/admin/branches";
import { getPublicBranchPath } from "@/lib/branch-utils";

export default async function AdminBranchesPage() {
  const adminUser = await requireAdmin();
  const branches = await getBranchesForAdmin(adminUser);
  const canEdit = adminUser.role === UserRole.SUPER_ADMIN || adminUser.role === UserRole.BRANCH_ADMIN;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Branch Management"
        title="Manage lodge branch details"
        description="Manage lodge branch details shown on the public website."
      />

      <RoleAccessNote
        role={adminUser.role}
        hasAssignedBranch={Boolean(adminUser.branchId)}
      />

      {branches.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {branches.map((branch) => (
            <article key={branch.id} className="surface-card px-6 py-7 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    {branch.city}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">{branch.name}</h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    {branch.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    label={branch.isActive ? "Active" : "Inactive"}
                    tone={branch.isActive ? "success" : "danger"}
                  />
                  {adminUser.role === UserRole.RECEPTIONIST ? (
                    <StatusBadge label="Read Only" tone="muted" />
                  ) : null}
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm leading-7 text-muted-foreground">
                <p>{branch.address}</p>
                <p>{branch.phone}</p>
                <p>{branch.email}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline">
                  <Link href={getPublicBranchPath(branch)} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Public Page
                  </Link>
                </Button>
                {canEdit ? (
                  <Button asChild>
                    <Link href={`/admin/branches/${branch.id}/edit`}>
                      <PencilLine className="mr-2 h-4 w-4" />
                      Edit Branch
                    </Link>
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="surface-card px-6 py-10 text-center sm:px-8">
          <h2 className="text-2xl font-semibold">No branch is assigned to this account.</h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Branch records are unavailable for your current role assignment. Contact a
            super admin if you need branch access.
          </p>
        </div>
      )}
    </section>
  );
}
