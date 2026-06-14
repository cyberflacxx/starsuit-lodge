import "server-only";

import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  type PrismaClient,
} from "@prisma/client";
import { getAvailableRooms, getNightCount } from "@/lib/availability";
import { generateBookingReference } from "@/lib/booking-reference";
import { notifyBookingCreated } from "@/lib/notifications/notification-service";
import { prisma } from "@/lib/prisma";
import {
  guestBookingSchema,
  type GuestBookingFormValues,
} from "@/lib/validations/booking";
import type { CreatedBookingResult } from "@/types";

function parseStayDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function parseArrivalDateTime(checkInDate: string, expectedArrivalTime: string) {
  return new Date(`${checkInDate}T${expectedArrivalTime}:00.000Z`);
}

function formatBookingResult(result: {
  bookingReference: string;
  totalAmount: Prisma.Decimal;
  payment: {
    id: string;
    status: PaymentStatus;
    amount: Prisma.Decimal;
    currency: string;
    method: PaymentMethod;
  } | null;
  branch: {
    id: string;
    name: string;
    city: string;
  };
  room: {
    id: string;
    roomNumber: string;
    status: string;
  } | null;
  roomType: {
    id: string;
    name: string;
    capacity: number;
    basePrice: Prisma.Decimal;
  };
  guest: {
    id: string;
    firstName: string;
    surname: string;
    phone: string;
    email: string;
  };
}): CreatedBookingResult {
  if (!result.payment || !result.room) {
    throw new Error("Booking creation failed. Please try again.");
  }

  return {
    bookingReference: result.bookingReference,
    totalAmount: Number(result.totalAmount),
    paymentId: result.payment.id,
    branch: {
      id: result.branch.id,
      name: result.branch.name,
      city: result.branch.city,
    },
    room: {
      id: result.room.id,
      roomNumber: result.room.roomNumber,
      status: result.room.status,
    },
    roomType: {
      id: result.roomType.id,
      name: result.roomType.name,
      capacity: result.roomType.capacity,
      basePrice: Number(result.roomType.basePrice),
    },
    guest: {
      id: result.guest.id,
      firstName: result.guest.firstName,
      surname: result.guest.surname,
      phone: result.guest.phone,
      email: result.guest.email,
    },
  };
}

function isUniqueBookingReferenceError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes("bookingReference")
  );
}

async function validateRoomContext(
  client: PrismaClient | Prisma.TransactionClient,
  values: GuestBookingFormValues,
) {
  const [branch, roomType, room] = await Promise.all([
    client.branch.findFirst({
      where: {
        id: values.branchId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        city: true,
      },
    }),
    client.roomType.findFirst({
      where: {
        id: values.roomTypeId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        capacity: true,
        basePrice: true,
      },
    }),
    client.room.findFirst({
      where: {
        id: values.roomId,
        branchId: values.branchId,
        roomTypeId: values.roomTypeId,
        isActive: true,
        status: "AVAILABLE",
      },
      select: {
        id: true,
        roomNumber: true,
        status: true,
      },
    }),
  ]);

  if (!branch) {
    throw new Error("Selected branch could not be found.");
  }

  if (!roomType) {
    throw new Error("Selected room type could not be found.");
  }

  if (!room) {
    throw new Error("Selected room could not be found.");
  }

  return {
    branch,
    roomType,
    room,
  };
}

async function assertRoomStillAvailable(
  client: PrismaClient | Prisma.TransactionClient,
  values: GuestBookingFormValues,
) {
  const overlappingBooking = await client.booking.findFirst({
    where: {
      roomId: values.roomId,
      branchId: values.branchId,
      roomTypeId: values.roomTypeId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
      },
      checkInDate: {
        lt: parseStayDate(values.checkOutDate),
      },
      checkOutDate: {
        gt: parseStayDate(values.checkInDate),
      },
    },
    select: {
      id: true,
    },
  });

  if (overlappingBooking) {
    throw new Error("Selected room is no longer available. Please check availability again.");
  }

  const maintenanceBlock = await client.roomMaintenanceBlock.findFirst({
    where: {
      roomId: values.roomId,
      startDate: {
        lt: parseStayDate(values.checkOutDate),
      },
      endDate: {
        gt: parseStayDate(values.checkInDate),
      },
    },
    select: {
      id: true,
    },
  });

  if (maintenanceBlock) {
    throw new Error("Selected room is no longer available. Please check availability again.");
  }
}

async function findOrCreateGuest(
  client: PrismaClient | Prisma.TransactionClient,
  values: GuestBookingFormValues,
) {
  const existingGuest = await client.guest.findFirst({
    where: {
      OR: [{ idNumber: values.idNumber }, { email: values.email }],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (existingGuest) {
    return client.guest.update({
      where: {
        id: existingGuest.id,
      },
      data: {
        firstName: values.firstName,
        surname: values.surname,
        idNumber: values.idNumber,
        gender: values.gender,
        phone: values.phone,
        email: values.email,
      },
    });
  }

  return client.guest.create({
    data: {
      firstName: values.firstName,
      surname: values.surname,
      idNumber: values.idNumber,
      gender: values.gender,
      phone: values.phone,
      email: values.email,
    },
  });
}

export async function createGuestBooking(rawValues: GuestBookingFormValues) {
  const roomContext = await validateRoomContext(prisma, rawValues);
  const validated = guestBookingSchema.parse({
    ...rawValues,
    roomTypeCapacity: roomContext.roomType.capacity,
  });

  const availableRooms = await getAvailableRooms({
    branchId: validated.branchId,
    roomTypeId: validated.roomTypeId,
    checkInDate: validated.checkInDate,
    checkOutDate: validated.checkOutDate,
    numberOfGuests: validated.numberOfGuests,
  });

  if (!availableRooms.some((room) => room.id === validated.roomId)) {
    throw new Error("Selected room is no longer available. Please check availability again.");
  }

  const nights = getNightCount(validated.checkInDate, validated.checkOutDate);
  const totalAmount = Number(roomContext.roomType.basePrice) * nights;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const bookingReference = generateBookingReference();

      const booking = await prisma.$transaction(async (tx) => {
        await validateRoomContext(tx, validated);
        await assertRoomStillAvailable(tx, validated);

        const guest = await findOrCreateGuest(tx, validated);

        const createdBooking = await tx.booking.create({
          data: {
            bookingReference,
            branchId: validated.branchId,
            roomTypeId: validated.roomTypeId,
            roomId: validated.roomId,
            guestId: guest.id,
            checkInDate: parseStayDate(validated.checkInDate),
            checkOutDate: parseStayDate(validated.checkOutDate),
            expectedArrivalTime: parseArrivalDateTime(
              validated.checkInDate,
              validated.expectedArrivalTime,
            ),
            numberOfGuests: validated.numberOfGuests,
            isBookingForTwo: validated.isBookingForTwo,
            transportOption: validated.transportOption,
            hasOwnCar: validated.hasOwnCar,
            needsParking: validated.needsParking,
            needsPickup: validated.needsPickup,
            pickupPoint: validated.pickupPoint,
            specialRequests: validated.specialRequests,
            status: BookingStatus.PENDING,
            paymentStatus: PaymentStatus.UNPAID,
            totalAmount,
          },
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
            room: {
              select: {
                id: true,
                roomNumber: true,
                status: true,
              },
            },
            roomType: {
              select: {
                id: true,
                name: true,
                capacity: true,
                basePrice: true,
              },
            },
            guest: {
              select: {
                id: true,
                firstName: true,
                surname: true,
                phone: true,
                email: true,
              },
            },
          },
        });

        const payment = await tx.payment.create({
          data: {
            bookingId: createdBooking.id,
            method: PaymentMethod.MOCK_ECOCASH,
            status: PaymentStatus.UNPAID,
            amount: totalAmount,
            currency: "USD",
          },
          select: {
            id: true,
            status: true,
            amount: true,
            currency: true,
            method: true,
          },
        });

        return {
          bookingReference: createdBooking.bookingReference,
          totalAmount: createdBooking.totalAmount,
          payment,
          branch: createdBooking.branch,
          room: createdBooking.room,
          roomType: createdBooking.roomType,
          guest: createdBooking.guest,
        };
      });

      const result = formatBookingResult(booking);

      void notifyBookingCreated(result.bookingReference).then((results) => {
        results
          .filter((item) => !item.success)
          .forEach((item) => console.error("Booking notification failed:", item.message));
      });

      return result;
    } catch (error) {
      if (attempt === 0 && isUniqueBookingReferenceError(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Booking creation failed. Please try again.");
}

export async function getBookingByReference(reference: string) {
  return prisma.booking.findUnique({
    where: {
      bookingReference: reference,
    },
    include: {
      branch: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          status: true,
        },
      },
      roomType: {
        select: {
          id: true,
          name: true,
          capacity: true,
          basePrice: true,
        },
      },
      guest: {
        select: {
          id: true,
          firstName: true,
          surname: true,
          idNumber: true,
          gender: true,
          phone: true,
          email: true,
        },
      },
      payment: {
        select: {
          id: true,
          method: true,
          status: true,
          amount: true,
          currency: true,
          transactionReference: true,
          providerReference: true,
          createdAt: true,
        },
      },
    },
  });
}
