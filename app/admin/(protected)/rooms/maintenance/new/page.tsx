import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { MaintenanceBlockForm } from "@/components/admin/maintenance-block-form";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { createMaintenanceBlockAction } from "@/app/admin/(protected)/rooms/actions";
import { requireAdmin } from "@/lib/auth";
import { getRoomsForAdmin } from "@/lib/admin/rooms";

export default async function NewMaintenanceBlockPage() {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    redirect("/admin/rooms");
  }

  const rooms = await getRoomsForAdmin(adminUser);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Maintenance Block"
        title="Schedule room maintenance"
        description="Temporarily mark a room as unavailable for maintenance preparation and future availability logic."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Link>
          </Button>
        }
      />

      <MaintenanceBlockForm
        rooms={rooms.map((room) => ({
          id: room.id,
          roomNumber: room.roomNumber,
          branchName: room.branch.name,
        }))}
        submitAction={createMaintenanceBlockAction}
      />
    </section>
  );
}
