import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { RoomForm } from "@/components/admin/room-form";
import { Button } from "@/components/ui/button";
import { updateRoomAction } from "@/app/admin/(protected)/rooms/actions";
import { requireAdmin } from "@/lib/auth";
import { getBranchesForAdmin } from "@/lib/admin/branches";
import { getRoomForAdmin, getRoomTypesForAdmin } from "@/lib/admin/rooms";

type EditRoomPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const adminUser = await requireAdmin();
  const { id } = await params;

  if (adminUser.role === UserRole.RECEPTIONIST) {
    redirect("/admin/rooms");
  }

  const room = await getRoomForAdmin(adminUser, id);

  if (!room) {
    notFound();
  }

  const [branches, roomTypes] = await Promise.all([
    getBranchesForAdmin(adminUser),
    getRoomTypesForAdmin(),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Edit Room"
        title={`Edit ${room.roomNumber}`}
        description="Update the room record, branch assignment, status, and notes."
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
        mode="edit"
        room={room}
        branches={branches}
        roomTypes={roomTypes}
        adminRole={adminUser.role}
        assignedBranchId={adminUser.branchId}
        submitAction={updateRoomAction.bind(null, room.id)}
      />
    </section>
  );
}
