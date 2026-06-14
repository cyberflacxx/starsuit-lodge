import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { RoomTypeForm } from "@/components/admin/room-type-form";
import { Button } from "@/components/ui/button";
import { updateRoomTypeAction } from "@/app/admin/(protected)/rooms/actions";
import { requireAdmin } from "@/lib/auth";
import { getRoomTypeById } from "@/lib/admin/rooms";

type EditRoomTypePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRoomTypePage({
  params,
}: EditRoomTypePageProps) {
  const adminUser = await requireAdmin();
  const { id } = await params;

  if (adminUser.role !== UserRole.SUPER_ADMIN) {
    redirect("/admin/rooms");
  }

  const roomType = await getRoomTypeById(id);

  if (!roomType) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Edit Room Type"
        title={roomType.name}
        description="Update global pricing, amenities, and capacity for this room type."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Link>
          </Button>
        }
      />

      <RoomTypeForm
        mode="edit"
        roomType={roomType}
        submitAction={updateRoomTypeAction.bind(null, roomType.id)}
      />
    </section>
  );
}
