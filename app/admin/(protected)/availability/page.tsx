import { PageHeader } from "@/components/admin/page-header";
import { RoleAccessNote } from "@/components/admin/role-access-note";
import { AvailabilitySearchForm } from "@/components/booking/availability-search-form";
import { checkAdminAvailabilityAction } from "@/app/admin/(protected)/availability/actions";
import { requireAdmin } from "@/lib/auth";
import { getBranchesForAdmin } from "@/lib/admin/branches";
import { getPublicBranchSlug } from "@/lib/branch-utils";
import { getRoomTypesForAdmin } from "@/lib/admin/rooms";

export default async function AdminAvailabilityPage() {
  const adminUser = await requireAdmin();
  const [branches, roomTypes] = await Promise.all([
    getBranchesForAdmin(adminUser),
    getRoomTypesForAdmin(),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Availability Preview"
        title="Check room availability"
        description="Use the same availability engine as the public booking page to preview room availability manually."
      />

      <RoleAccessNote
        role={adminUser.role}
        hasAssignedBranch={Boolean(adminUser.branchId || adminUser.role === "SUPER_ADMIN")}
      />

      <div className="surface-card px-6 py-8 sm:px-8">
        <AvailabilitySearchForm
          branches={branches.map((branch) => ({
            id: branch.id,
            name: branch.name,
            slug: branch.slug,
            publicSlug: getPublicBranchSlug(branch),
            city: branch.city,
            phone: branch.phone,
            email: branch.email,
            isActive: branch.isActive,
          }))}
          roomTypes={roomTypes.map((roomType) => ({
            id: roomType.id,
            name: roomType.name,
            slug: roomType.slug,
            basePrice: roomType.basePrice.toFixed(2),
            capacity: roomType.capacity,
            bedType: roomType.bedType,
            amenities: roomType.amenities,
            isActive: roomType.isActive,
          }))}
          submitAction={checkAdminAvailabilityAction}
          lockedBranchId={adminUser.role === "SUPER_ADMIN" ? undefined : adminUser.branchId ?? undefined}
          showContinueButton={false}
        />
      </div>
    </section>
  );
}
