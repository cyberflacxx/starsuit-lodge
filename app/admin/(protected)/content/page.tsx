import Image from "next/image";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { PageHeader } from "@/components/admin/page-header";
import { RoleAccessNote } from "@/components/admin/role-access-note";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import {
  getContentBlocksForAdmin,
  getGalleryImagesForAdmin,
  getServicesForAdmin,
} from "@/lib/admin/content";

function statusTone(
  status: string,
): "primary" | "draft" | "published" | "archived" | "featured" | "inactive" {
  if (status === "PUBLISHED" || status === "Active") return "published";
  if (status === "ARCHIVED") return "archived";
  if (status === "DRAFT") return "draft";
  if (status === "Featured") return "featured";
  if (status === "Inactive") return "inactive";
  return "primary";
}

export default async function AdminContentPage() {
  const adminUser = await requireAdmin();
  const [contentBlocks, services, galleryImages] = await Promise.all([
    getContentBlocksForAdmin(adminUser),
    getServicesForAdmin(adminUser),
    getGalleryImagesForAdmin(adminUser),
  ]);
  const canEdit = adminUser.role !== UserRole.RECEPTIONIST;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Website Content"
        title="Website Content Management"
        description="Manage public website text, services, and gallery content."
      />
      <RoleAccessNote
        role={adminUser.role}
        hasAssignedBranch={Boolean(adminUser.branchId)}
      />

      <section className="surface-card px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Content Blocks</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Homepage copy, about content, booking policy, cancellation policy, and contact display content.
            </p>
          </div>
          {canEdit ? (
            <Button asChild>
              <Link href="/admin/content/blocks/new">Create Content Block</Link>
            </Button>
          ) : null}
        </div>

        {contentBlocks.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-4 py-4">Key</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Branch</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Updated</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {contentBlocks.map((block) => (
                  <tr key={block.id}>
                    <td className="px-4 py-4 font-semibold">{block.key}</td>
                    <td className="px-4 py-4">{block.title}</td>
                    <td className="px-4 py-4">{block.branch?.name ?? "Global"}</td>
                    <td className="px-4 py-4">
                      <StatusBadge label={block.status} tone={statusTone(block.status)} />
                    </td>
                    <td className="px-4 py-4">
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(block.updatedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/content/blocks/${block.id}/edit`}
                        className="font-semibold text-primary hover:text-accent"
                      >
                        View or Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
            No content blocks yet.
          </div>
        )}
      </section>

      <section className="surface-card px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Services</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Manage guest-facing service descriptions for the homepage and branch pages.
            </p>
          </div>
          {canEdit ? (
            <Button asChild>
              <Link href="/admin/content/services/new">Create Service</Link>
            </Button>
          ) : null}
        </div>

        {services.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Branch</th>
                  <th className="px-4 py-4">Active</th>
                  <th className="px-4 py-4">Icon</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-4 font-semibold">{service.title}</td>
                    <td className="px-4 py-4">{service.branch?.name ?? "Global"}</td>
                    <td className="px-4 py-4">
                      <StatusBadge label={service.isActive ? "Active" : "Inactive"} tone={service.isActive ? "published" : "inactive"} />
                    </td>
                    <td className="px-4 py-4">{service.iconName || "Default"}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/content/services/${service.id}/edit`}
                        className="font-semibold text-primary hover:text-accent"
                      >
                        View or Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
            No services yet.
          </div>
        )}
      </section>

      <section className="surface-card px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Gallery Images</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Add and order public gallery images. URL entry is supported now.
            </p>
          </div>
          {canEdit ? (
            <Button asChild>
              <Link href="/admin/content/gallery/new">Add Gallery Image</Link>
            </Button>
          ) : null}
        </div>

        {galleryImages.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {galleryImages.map((image) => (
              <div key={image.id} className="rounded-[1.6rem] border border-border bg-white p-4">
                <Image
                  src={image.imageUrl}
                  alt={image.altText}
                  width={640}
                  height={384}
                  className="h-48 w-full rounded-2xl object-cover"
                  unoptimized
                />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatusBadge label={image.isFeatured ? "Featured" : "Standard"} tone={image.isFeatured ? "featured" : "muted"} />
                  <StatusBadge label={image.isActive ? "Active" : "Inactive"} tone={image.isActive ? "published" : "inactive"} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{image.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {image.branch?.name ?? "Global"} | Sort order {image.sortOrder}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/admin/content/gallery/${image.id}/edit`}
                    className="font-semibold text-primary hover:text-accent"
                  >
                    View or Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
            No gallery images yet.
          </div>
        )}
      </section>
    </div>
  );
}
