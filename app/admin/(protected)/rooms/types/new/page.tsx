import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { RoomTypeForm } from "@/components/admin/room-type-form";
import { Button } from "@/components/ui/button";
import { createRoomTypeAction } from "@/app/admin/(protected)/rooms/actions";
import { requireAdmin } from "@/lib/auth";

export default async function NewRoomTypePage() {
  const adminUser = await requireAdmin();

  if (adminUser.role !== UserRole.SUPER_ADMIN) {
    redirect("/admin/rooms");
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Create Room Type"
        title="Add a global room type"
        description="Room types control public pricing, amenities, bed type, and capacity across all branches."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Link>
          </Button>
        }
      />

      <RoomTypeForm mode="create" submitAction={createRoomTypeAction} />
    </section>
  );
}
