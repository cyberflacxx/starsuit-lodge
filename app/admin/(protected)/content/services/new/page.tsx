import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/content/service-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { getActiveBranchSummaries } from "@/lib/public-data";
import { createServiceAction } from "@/app/admin/content/actions";

export default async function NewServicePage() {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    notFound();
  }

  const branches = await getActiveBranchSummaries();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Services"
        title="Create Service"
        description="Add a new public service for all branches or your assigned branch."
      />
      <ServiceForm
        mode="create"
        branches={branches}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={createServiceAction}
      />
    </div>
  );
}
