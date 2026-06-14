import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ContentBlockForm } from "@/components/admin/content/content-block-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { getContentBlockForAdmin } from "@/lib/admin/content";
import { getActiveBranchSummaries } from "@/lib/public-data";
import { updateContentBlockAction } from "@/app/admin/content/actions";

type EditContentBlockPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditContentBlockPage({
  params,
}: EditContentBlockPageProps) {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    notFound();
  }

  const { id } = await params;
  const [block, branches] = await Promise.all([
    getContentBlockForAdmin(adminUser, id),
    getActiveBranchSummaries(),
  ]);

  if (!block) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content Blocks"
        title="Edit Content Block"
        description="Update published, draft, or archived website copy."
      />
      <ContentBlockForm
        mode="edit"
        block={block}
        branches={branches}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={updateContentBlockAction}
      />
    </div>
  );
}
