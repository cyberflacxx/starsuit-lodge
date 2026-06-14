import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { GalleryImageForm } from "@/components/admin/content/gallery-image-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { getActiveBranchSummaries } from "@/lib/public-data";
import { createGalleryImageAction } from "@/app/admin/content/actions";

export default async function NewGalleryImagePage() {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    notFound();
  }

  const branches = await getActiveBranchSummaries();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gallery"
        title="Add Gallery Image"
        description="Add a new public gallery image for a global page or your assigned branch."
      />
      <GalleryImageForm
        mode="create"
        branches={branches}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={createGalleryImageAction}
      />
    </div>
  );
}
