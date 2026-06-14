import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { GalleryImageForm } from "@/components/admin/content/gallery-image-form";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getGalleryImageForAdmin } from "@/lib/admin/content";
import { getActiveBranchSummaries } from "@/lib/public-data";
import {
  submitDeleteGalleryImageAction,
  updateGalleryImageAction,
} from "@/app/admin/content/actions";

type EditGalleryImagePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditGalleryImagePage({
  params,
}: EditGalleryImagePageProps) {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    notFound();
  }

  const { id } = await params;
  const [image, branches] = await Promise.all([
    getGalleryImageForAdmin(adminUser, id),
    getActiveBranchSummaries(),
  ]);

  if (!image) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gallery"
        title="Edit Gallery Image"
        description="Update ordering, feature state, and visibility for this image."
      />
      <GalleryImageForm
        mode="edit"
        image={image}
        branches={branches}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={updateGalleryImageAction}
      />
      <form action={submitDeleteGalleryImageAction} className="surface-card px-6 py-6 sm:px-8">
        <input type="hidden" name="id" value={image.id} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Disable image</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              This keeps the record for audit history and removes it from public displays.
            </p>
          </div>
          <Button type="submit" variant="outline">
            Disable Gallery Image
          </Button>
        </div>
      </form>
    </div>
  );
}
