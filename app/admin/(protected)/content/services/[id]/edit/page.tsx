import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/content/service-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { getServiceForAdmin } from "@/lib/admin/content";
import { getActiveBranchSummaries } from "@/lib/public-data";
import { updateServiceAction } from "@/app/admin/content/actions";

type EditServicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    notFound();
  }

  const { id } = await params;
  const [service, branches] = await Promise.all([
    getServiceForAdmin(adminUser, id),
    getActiveBranchSummaries(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Services"
        title="Edit Service"
        description="Update the active state and public description for this service."
      />
      <ServiceForm
        mode="edit"
        service={service}
        branches={branches}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={updateServiceAction}
      />
    </div>
  );
}
