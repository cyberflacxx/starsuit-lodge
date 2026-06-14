import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ContentBlockForm } from "@/components/admin/content/content-block-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { getActiveBranchSummaries } from "@/lib/public-data";
import { createContentBlockAction } from "@/app/admin/content/actions";

export default async function NewContentBlockPage() {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    notFound();
  }

  const branches = await getActiveBranchSummaries();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content Blocks"
        title="Create Content Block"
        description="Add a new public content block for a global page or your assigned branch."
      />
      <ContentBlockForm
        mode="create"
        branches={branches}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={createContentBlockAction}
      />
    </div>
  );
}
