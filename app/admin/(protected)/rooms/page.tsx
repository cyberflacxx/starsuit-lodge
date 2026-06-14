import Link from "next/link";
import { UserRole } from "@prisma/client";
import { ExternalLink, Hammer, Hotel, Layers3, PencilLine, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { RoleAccessNote } from "@/components/admin/role-access-note";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getBranchesForAdmin } from "@/lib/admin/branches";
import {
  getMaintenanceBlocksForAdmin,
  getRoomsForAdmin,
  getRoomTypesForAdmin,
} from "@/lib/admin/rooms";
import { removeMaintenanceBlockAction } from "@/app/admin/(protected)/rooms/actions";

function getRoomStatusTone(status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED") {
  switch (status) {
    case "AVAILABLE":
      return "available" as const;
    case "OCCUPIED":
      return "occupied" as const;
    case "MAINTENANCE":
      return "maintenance" as const;
    case "BLOCKED":
      return "blocked" as const;
    default:
      return "muted" as const;
  }
}

export default async function AdminRoomsPage() {
  const adminUser = await requireAdmin();
  const [roomTypes, rooms, maintenanceBlocks, branches] = await Promise.all([
    getRoomTypesForAdmin(),
    getRoomsForAdmin(adminUser),
    getMaintenanceBlocksForAdmin(adminUser),
    getBranchesForAdmin(adminUser),
  ]);

  const canManageRoomTypes = adminUser.role === UserRole.SUPER_ADMIN;
  const canManageRooms =
    adminUser.role === UserRole.SUPER_ADMIN ||
    adminUser.role === UserRole.BRANCH_ADMIN;
  const canManageMaintenance = canManageRooms;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Room Management"
        title="Manage room types, rooms, and maintenance"
        description="Manage room types, individual rooms, status, and maintenance blocks."
        actions={
          <div className="flex flex-wrap gap-3">
            {canManageRoomTypes ? (
              <Button asChild>
                <Link href="/admin/rooms/types/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Room Type
                </Link>
              </Button>
            ) : null}
            {canManageRooms ? (
              <Button asChild variant="outline">
                <Link href="/admin/rooms/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Link>
              </Button>
            ) : null}
            {canManageMaintenance ? (
              <Button asChild variant="outline">
                <Link href="/admin/rooms/maintenance/new">
                  <Hammer className="mr-2 h-4 w-4" />
                  Add Maintenance Block
                </Link>
              </Button>
            ) : null}
          </div>
        }
      />

      <RoleAccessNote
        role={adminUser.role}
        hasAssignedBranch={Boolean(adminUser.branchId || adminUser.role === UserRole.SUPER_ADMIN)}
      />

      <div className="surface-card px-6 py-8 sm:px-8">
        <div className="flex items-center gap-3">
          <Layers3 className="h-5 w-5 text-primary" />
          <h2 className="text-3xl font-semibold">Room Types</h2>
        </div>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Global room types control public prices, amenities, bed type, and capacity.
        </p>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {roomTypes.length ? (
            roomTypes.map((roomType) => (
              <article key={roomType.id} className="rounded-3xl border border-border bg-muted px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">{roomType.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      ${roomType.basePrice.toFixed(2)} per night
                    </p>
                  </div>
                  <StatusBadge
                    label={roomType.isActive ? "Active" : "Inactive"}
                    tone={roomType.isActive ? "success" : "danger"}
                  />
                </div>
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <p>Capacity: {roomType.capacity}</p>
                  <p>Bed type: {roomType.bedType}</p>
                  <p>Amenities: {roomType.amenities.join(", ")}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {canManageRoomTypes ? (
                    <Button asChild size="default">
                      <Link href={`/admin/rooms/types/${roomType.id}/edit`}>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  ) : (
                    <StatusBadge label="Read Only" tone="muted" />
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-border bg-muted px-5 py-6 xl:col-span-3">
              <p className="text-base leading-7 text-muted-foreground">
                No room types are available yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="surface-card px-6 py-8 sm:px-8">
        <div className="flex items-center gap-3">
          <Hotel className="h-5 w-5 text-primary" />
          <h2 className="text-3xl font-semibold">Rooms</h2>
        </div>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Rooms belong to specific branches and feed the future availability engine.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3 pr-4 font-semibold">Room Number</th>
                <th className="pb-3 pr-4 font-semibold">Branch</th>
                <th className="pb-3 pr-4 font-semibold">Room Type</th>
                <th className="pb-3 pr-4 font-semibold">Floor</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Active</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length ? (
                rooms.map((room) => (
                  <tr key={room.id} className="border-t border-border">
                    <td className="py-4 pr-4 font-semibold">{room.roomNumber}</td>
                    <td className="py-4 pr-4">{room.branch.name}</td>
                    <td className="py-4 pr-4">{room.roomType.name}</td>
                    <td className="py-4 pr-4">{room.floor ?? "-"}</td>
                    <td className="py-4 pr-4">
                      <StatusBadge label={room.status} tone={getRoomStatusTone(room.status)} />
                    </td>
                    <td className="py-4 pr-4">
                      <StatusBadge
                        label={room.isActive ? "Active" : "Inactive"}
                        tone={room.isActive ? "success" : "danger"}
                      />
                    </td>
                    <td className="py-4">
                      {canManageRooms ? (
                        <Button asChild variant="outline">
                          <Link href={`/admin/rooms/${room.id}/edit`}>
                            <PencilLine className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                      ) : (
                        <StatusBadge label="Read Only" tone="muted" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-muted-foreground">
                    No rooms are available for your current access level.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!branches.length && adminUser.role !== UserRole.SUPER_ADMIN ? (
          <p className="mt-6 text-sm text-accent">
            No branch is assigned to this account, so room management is unavailable.
          </p>
        ) : null}
      </div>

      <div className="surface-card px-6 py-8 sm:px-8">
        <div className="flex items-center gap-3">
          <Hammer className="h-5 w-5 text-primary" />
          <h2 className="text-3xl font-semibold">Maintenance Blocks</h2>
        </div>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Maintenance blocks temporarily mark rooms unavailable and switch room status to maintenance.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3 pr-4 font-semibold">Room</th>
                <th className="pb-3 pr-4 font-semibold">Branch</th>
                <th className="pb-3 pr-4 font-semibold">Start Date</th>
                <th className="pb-3 pr-4 font-semibold">End Date</th>
                <th className="pb-3 pr-4 font-semibold">Reason</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceBlocks.length ? (
                maintenanceBlocks.map((block) => (
                  <tr key={block.id} className="border-t border-border">
                    <td className="py-4 pr-4 font-semibold">{block.room.roomNumber}</td>
                    <td className="py-4 pr-4">{block.room.branch.name}</td>
                    <td className="py-4 pr-4">
                      {block.startDate.toISOString().slice(0, 10)}
                    </td>
                    <td className="py-4 pr-4">
                      {block.endDate.toISOString().slice(0, 10)}
                    </td>
                    <td className="py-4 pr-4">{block.reason}</td>
                    <td className="py-4">
                      {canManageMaintenance ? (
                        <form
                          action={async () => {
                            "use server";
                            await removeMaintenanceBlockAction(block.id);
                          }}
                        >
                          <Button type="submit" variant="outline">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </form>
                      ) : (
                        <StatusBadge label="Read Only" tone="muted" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-muted-foreground">
                    No maintenance blocks are active for your current access level.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/rooms">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Rooms Page
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
