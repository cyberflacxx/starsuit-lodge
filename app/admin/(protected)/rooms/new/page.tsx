import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { RoomForm } from "@/components/admin/room-form";
import { Button } from "@/components/ui/button";
import { createRoomAction } from "@/app/admin/(protected)/rooms/actions";
import { requireAdmin } from "@/lib/auth";
import { getBranchesForAdmin } from "@/lib/admin/branches";
import { getRoomTypesForAdmin } from "@/lib/admin/rooms";

export default async function NewRoomPage() {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.RECEPTIONIST) {
    redirect("/admin/rooms");
  }

  const [branches, roomTypes] = await Promise.all([
    getBranchesForAdmin(adminUser),
    getRoomTypesForAdmin(),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Create Room"
        title="Add a new room"
        description="Create a branch-specific room record that will later feed the availability engine."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Link>
          </Button>
        }
      />

      <RoomForm
        mode="create"
        branches={branches}
        roomTypes={roomTypes}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={createRoomAction}
      />
    </section>
  );
}
