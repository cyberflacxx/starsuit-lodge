import "server-only";

import { BookingStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  availabilitySearchSchema,
  type AvailabilitySearchValues,
} from "@/lib/validations/availability";
import type { AvailabilityRoom, AvailabilitySummary } from "@/types";

const blockingStatuses = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
] as const;

function parseDateValue(value: string | Date) {
  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  return new Date(`${value}T00:00:00.000Z`);
}

export function getNightCount(checkInDate: string | Date, checkOutDate: string | Date) {
  const checkIn = parseDateValue(checkInDate);
  const checkOut = parseDateValue(checkOutDate);
  const difference = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);

  return Math.max(1, difference);
}

export function hasDateOverlap(
  existingStart: string | Date,
  existingEnd: string | Date,
  requestedStart: string | Date,
  requestedEnd: string | Date,
) {
  const existingStartDate = parseDateValue(existingStart);
  const existingEndDate = parseDateValue(existingEnd);
  const requestedStartDate = parseDateValue(requestedStart);
  const requestedEndDate = parseDateValue(requestedEnd);

  return (
    existingStartDate < requestedEndDate && existingEndDate > requestedStartDate
  );
}

export async function getUnavailableRoomIds(params: {
  branchId: string;
  roomTypeId?: string;
  checkInDate: string;
  checkOutDate: string;
}) {
  const bookingFilter: Prisma.BookingWhereInput = {
    branchId: params.branchId,
    roomId: {
      not: null,
    },
    status: {
      in: [...blockingStatuses],
    },
    checkInDate: {
      lt: parseDateValue(params.checkOutDate),
    },
    checkOutDate: {
      gt: parseDateValue(params.checkInDate),
    },
  };

  if (params.roomTypeId) {
    bookingFilter.roomTypeId = params.roomTypeId;
  }

  const maintenanceFilter: Prisma.RoomMaintenanceBlockWhereInput = {
    room: {
      branchId: params.branchId,
    },
    startDate: {
      lt: parseDateValue(params.checkOutDate),
    },
    endDate: {
      gt: parseDateValue(params.checkInDate),
    },
  };

  if (params.roomTypeId) {
    maintenanceFilter.room = {
      branchId: params.branchId,
      roomTypeId: params.roomTypeId,
    };
  }

  const [bookings, maintenanceBlocks] = await Promise.all([
    prisma.booking.findMany({
      where: bookingFilter,
      select: {
        roomId: true,
      },
    }),
    prisma.roomMaintenanceBlock.findMany({
      where: maintenanceFilter,
      select: {
        roomId: true,
      },
    }),
  ]);

  return Array.from(
    new Set(
      [...bookings.map((booking) => booking.roomId), ...maintenanceBlocks.map((block) => block.roomId)].filter(
        Boolean,
      ),
    ),
  ) as string[];
}

export async function getAvailableRooms(params: AvailabilitySearchValues) {
  const parsed = availabilitySearchSchema.parse(params);
  const unavailableRoomIds = await getUnavailableRoomIds({
    branchId: parsed.branchId,
    roomTypeId: parsed.roomTypeId || undefined,
    checkInDate: parsed.checkInDate,
    checkOutDate: parsed.checkOutDate,
  });

  const rooms = await prisma.room.findMany({
    where: {
      branchId: parsed.branchId,
      isActive: true,
      status: "AVAILABLE",
      roomTypeId: parsed.roomTypeId || undefined,
      roomType: {
        isActive: true,
        capacity: {
          gte: parsed.numberOfGuests,
        },
      },
      branch: {
        isActive: true,
      },
      id: unavailableRoomIds.length
        ? {
            notIn: unavailableRoomIds,
          }
        : undefined,
    },
    include: {
      branch: true,
      roomType: true,
    },
    orderBy: {
      roomNumber: "asc",
    },
  });

  const nights = getNightCount(parsed.checkInDate, parsed.checkOutDate);

  return rooms.map(
    (room): AvailabilityRoom => ({
      id: room.id,
      roomNumber: room.roomNumber,
      branchId: room.branchId,
      branchName: room.branch.name,
      roomTypeId: room.roomTypeId,
      roomTypeName: room.roomType.name,
      capacity: room.roomType.capacity,
      pricePerNight: Number(room.roomType.basePrice),
      estimatedTotal: Number(room.roomType.basePrice) * nights,
      status: room.status,
    }),
  );
}

export async function getAvailabilitySummary(
  params: AvailabilitySearchValues,
): Promise<AvailabilitySummary> {
  const parsed = availabilitySearchSchema.parse(params);

  const [branch, roomType, availableRooms] = await Promise.all([
    prisma.branch.findFirst({
      where: {
        id: parsed.branchId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        city: true,
      },
    }),
    parsed.roomTypeId
      ? prisma.roomType.findFirst({
          where: {
            id: parsed.roomTypeId,
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        })
      : Promise.resolve(null),
    getAvailableRooms(parsed),
  ]);

  const nights = getNightCount(parsed.checkInDate, parsed.checkOutDate);
  const availableCount = availableRooms.length;
  const lowestPrice =
    availableCount > 0
      ? Math.min(...availableRooms.map((room) => room.pricePerNight))
      : null;
  const estimatedTotalFrom =
    lowestPrice !== null ? lowestPrice * nights : null;
  const isFullyBooked = availableCount === 0;

  return {
    branch: branch
      ? {
          id: branch.id,
          name: branch.name,
          city: branch.city,
        }
      : null,
    roomType: roomType
      ? {
          id: roomType.id,
          name: roomType.name,
          slug: roomType.slug,
        }
      : null,
    checkInDate: parsed.checkInDate,
    checkOutDate: parsed.checkOutDate,
    nights,
    numberOfGuests: parsed.numberOfGuests,
    availableRooms,
    availableCount,
    lowestPrice,
    estimatedTotalFrom,
    isFullyBooked,
    message:
      availableCount > 0
        ? "Rooms are available for your selected dates."
        : "No rooms are available for your selected dates. Select another branch, room type, or date range.",
  };
}
