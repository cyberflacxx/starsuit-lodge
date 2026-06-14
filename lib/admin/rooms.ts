import "server-only";

import { AuditAction, Prisma, RoomStatus, UserRole, type Branch, type Room, type RoomMaintenanceBlock, type RoomType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuthenticatedAdmin } from "@/lib/auth";
import type {
  MaintenanceBlockFormValues,
  RoomFormValues,
  RoomTypeFormValues,
} from "@/lib/validations/room";

export async function getRoomTypesForAdmin() {
  return prisma.roomType.findMany({
    orderBy: {
      basePrice: "asc",
    },
  });
}

export async function getRoomTypeById(roomTypeId: string) {
  return prisma.roomType.findUnique({
    where: {
      id: roomTypeId,
    },
  });
}

function ensureSuperAdmin(adminUser: AuthenticatedAdmin) {
  if (adminUser.role !== UserRole.SUPER_ADMIN) {
    throw new Error("Only super admins can manage room types.");
  }
}

function buildChangedFields<T extends object>(
  before: T,
  after: Record<string, unknown>,
): Prisma.InputJsonObject {
  const changedFields: Record<
    string,
    { before: Prisma.InputJsonValue | null; after: Prisma.InputJsonValue | null }
  > = {};

  const normalizeValue = (value: unknown): Prisma.InputJsonValue | null => {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === "string" || typeof item === "number" || typeof item === "boolean"
          ? item
          : String(item),
      );
    }

    return String(value);
  };

  Object.entries(after).forEach(([key, value]) => {
    if (before[key as keyof T] !== value) {
      changedFields[key] = {
        before: normalizeValue(before[key as keyof T]),
        after: normalizeValue(value),
      };
    }
  });

  return changedFields;
}

export async function createRoomTypeForAdmin(
  adminUser: AuthenticatedAdmin,
  data: RoomTypeFormValues,
) {
  ensureSuperAdmin(adminUser);

  try {
    const roomType = await prisma.roomType.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        capacity: data.capacity,
        bedType: data.bedType,
        amenities: data.amenities,
        isActive: data.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: adminUser.id,
        action: AuditAction.CREATE,
        entity: "RoomType",
        entityId: roomType.id,
        description: "Room type created",
      },
    });

    return roomType;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("That room type slug is already in use.");
    }

    throw new Error("Room type creation failed. Please try again.");
  }
}

export async function updateRoomTypeForAdmin(
  adminUser: AuthenticatedAdmin,
  roomTypeId: string,
  data: RoomTypeFormValues,
) {
  ensureSuperAdmin(adminUser);

  const existingRoomType = await getRoomTypeById(roomTypeId);

  if (!existingRoomType) {
    throw new Error("Room type not found.");
  }

  try {
    const roomType = await prisma.roomType.update({
      where: {
        id: roomTypeId,
      },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        capacity: data.capacity,
        bedType: data.bedType,
        amenities: data.amenities,
        isActive: data.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: adminUser.id,
        action: AuditAction.UPDATE,
        entity: "RoomType",
        entityId: roomType.id,
        description: "Room type updated",
        metadata: buildChangedFields(existingRoomType, {
          name: data.name,
          slug: data.slug,
          description: data.description,
          basePrice: data.basePrice,
          capacity: data.capacity,
          bedType: data.bedType,
          amenities: data.amenities,
          isActive: data.isActive,
        }),
      },
    });

    return roomType;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("That room type slug is already in use.");
    }

    throw new Error("Room type update failed. Please try again.");
  }
}

export async function getRoomsForAdmin(adminUser: AuthenticatedAdmin) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return prisma.room.findMany({
      include: {
        branch: true,
        roomType: true,
        maintenanceBlocks: {
          orderBy: {
            startDate: "asc",
          },
        },
      },
      orderBy: [{ branch: { city: "asc" } }, { roomNumber: "asc" }],
    });
  }

  if (!adminUser.branchId) {
    return [] as Array<
      Room & {
        branch: Branch;
        roomType: RoomType;
        maintenanceBlocks: RoomMaintenanceBlock[];
      }
    >;
  }

  return prisma.room.findMany({
    where: {
      branchId: adminUser.branchId,
    },
    include: {
      branch: true,
      roomType: true,
      maintenanceBlocks: {
        orderBy: {
          startDate: "asc",
        },
      },
    },
    orderBy: [{ branch: { city: "asc" } }, { roomNumber: "asc" }],
  });
}

export async function getRoomForAdmin(adminUser: AuthenticatedAdmin, roomId: string) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      branch: true,
      roomType: true,
      maintenanceBlocks: {
        orderBy: {
          startDate: "asc",
        },
      },
    },
  });

  if (!room) {
    return null;
  }

  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return room;
  }

  if (!adminUser.branchId || adminUser.branchId !== room.branchId) {
    return null;
  }

  return room;
}

function ensureRoomMutationAccess(
  adminUser: AuthenticatedAdmin,
  branchId: string,
) {
  if (adminUser.role === UserRole.RECEPTIONIST) {
    throw new Error("Receptionists can view rooms but cannot edit them.");
  }

  if (
    adminUser.role === UserRole.BRANCH_ADMIN &&
    adminUser.branchId !== branchId
  ) {
    throw new Error("You do not have access to manage rooms for this branch.");
  }
}

export async function createRoomForAdmin(
  adminUser: AuthenticatedAdmin,
  data: RoomFormValues,
) {
  ensureRoomMutationAccess(adminUser, data.branchId);

  try {
    const room = await prisma.room.create({
      data: {
        branchId: data.branchId,
        roomTypeId: data.roomTypeId,
        roomNumber: data.roomNumber,
        floor: data.floor,
        status: data.status,
        notes: data.notes || null,
        isActive: data.isActive,
      },
      include: {
        branch: true,
        roomType: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: adminUser.id,
        action: AuditAction.CREATE,
        entity: "Room",
        entityId: room.id,
        description: "Room created",
      },
    });

    return room;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("That room number already exists in the selected branch.");
    }

    throw new Error("Room creation failed. Please try again.");
  }
}

export async function updateRoomForAdmin(
  adminUser: AuthenticatedAdmin,
  roomId: string,
  data: RoomFormValues,
) {
  const existingRoom = await getRoomForAdmin(adminUser, roomId);

  if (!existingRoom) {
    throw new Error("Room not found or you do not have access to it.");
  }

  ensureRoomMutationAccess(adminUser, existingRoom.branchId);

  if (
    adminUser.role === UserRole.BRANCH_ADMIN &&
    data.branchId !== existingRoom.branchId
  ) {
    throw new Error("Branch admins cannot move rooms to another branch.");
  }

  try {
    const room = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        branchId: data.branchId,
        roomTypeId: data.roomTypeId,
        roomNumber: data.roomNumber,
        floor: data.floor,
        status: data.status,
        notes: data.notes || null,
        isActive: data.isActive,
      },
      include: {
        branch: true,
        roomType: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: adminUser.id,
        action:
          existingRoom.status !== data.status
            ? AuditAction.ROOM_STATUS_CHANGE
            : AuditAction.UPDATE,
        entity: "Room",
        entityId: room.id,
        description:
          existingRoom.status !== data.status
            ? "Room status changed"
            : "Room details updated",
        metadata: buildChangedFields(existingRoom, {
          branchId: data.branchId,
          roomTypeId: data.roomTypeId,
          roomNumber: data.roomNumber,
          floor: data.floor,
          status: data.status,
          notes: data.notes || null,
          isActive: data.isActive,
        }),
      },
    });

    return room;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("That room number already exists in the selected branch.");
    }

    throw new Error("Room update failed. Please try again.");
  }
}

export async function getMaintenanceBlocksForAdmin(adminUser: AuthenticatedAdmin) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return prisma.roomMaintenanceBlock.findMany({
      include: {
        room: {
          include: {
            branch: true,
          },
        },
      },
      orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
    });
  }

  if (!adminUser.branchId) {
    return [];
  }

  return prisma.roomMaintenanceBlock.findMany({
    where: {
      room: {
        branchId: adminUser.branchId,
      },
    },
    include: {
      room: {
        include: {
          branch: true,
        },
      },
    },
    orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
  });
}

export async function createMaintenanceBlockForAdmin(
  adminUser: AuthenticatedAdmin,
  data: MaintenanceBlockFormValues,
) {
  const room = await getRoomForAdmin(adminUser, data.roomId);

  if (!room) {
    throw new Error("Room not found or you do not have access to it.");
  }

  ensureRoomMutationAccess(adminUser, room.branchId);

  const block = await prisma.roomMaintenanceBlock.create({
    data: {
      roomId: data.roomId,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    },
    include: {
      room: true,
    },
  });

  await prisma.room.update({
    where: {
      id: data.roomId,
    },
    data: {
      status: RoomStatus.MAINTENANCE,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.ROOM_STATUS_CHANGE,
      entity: "RoomMaintenanceBlock",
      entityId: block.id,
      description: "Maintenance block created",
    },
  });

  return block;
}

export async function removeMaintenanceBlockForAdmin(
  adminUser: AuthenticatedAdmin,
  blockId: string,
) {
  const block = await prisma.roomMaintenanceBlock.findUnique({
    where: {
      id: blockId,
    },
    include: {
      room: true,
    },
  });

  if (!block) {
    throw new Error("Maintenance block not found.");
  }

  const room = await getRoomForAdmin(adminUser, block.roomId);

  if (!room) {
    throw new Error("You do not have access to remove this maintenance block.");
  }

  ensureRoomMutationAccess(adminUser, room.branchId);

  await prisma.roomMaintenanceBlock.delete({
    where: {
      id: blockId,
    },
  });

  const now = new Date();
  const activeBlocks = await prisma.roomMaintenanceBlock.count({
    where: {
      roomId: block.roomId,
      startDate: {
        lte: now,
      },
      endDate: {
        gte: now,
      },
    },
  });

  if (activeBlocks === 0) {
    await prisma.room.update({
      where: {
        id: block.roomId,
      },
      data: {
        status: RoomStatus.AVAILABLE,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.UPDATE,
      entity: "RoomMaintenanceBlock",
      entityId: blockId,
      description: "Maintenance block removed",
    },
  });

  return true;
}
