import "server-only";

import { AuditAction, BookingStatus, PaymentMethod, PaymentStatus, Prisma, UserRole } from "@prisma/client";
import type { AuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  BookingFilterValues,
  PaymentVerificationValues,
} from "@/lib/validations/admin-booking";

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function endOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
}

function getAccessibleBranchId(adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return null;
  }

  return adminUser.branchId;
}

function buildAccessWhere(adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">): Prisma.BookingWhereInput | null {
  const branchId = getAccessibleBranchId(adminUser);

  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return {};
  }

  if (!branchId) {
    return null;
  }

  return {
    branchId,
  };
}

function canAccessBooking(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  branchId: string,
) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  return Boolean(adminUser.branchId && adminUser.branchId === branchId);
}

export async function getBookingsForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  filters: BookingFilterValues,
) {
  const accessWhere = buildAccessWhere(adminUser);

  if (accessWhere === null) {
    return [];
  }

  const where: Prisma.BookingWhereInput = { ...accessWhere };

  if (filters.branchId && adminUser.role === UserRole.SUPER_ADMIN) {
    where.branchId = filters.branchId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  if (filters.search) {
    where.OR = [
      {
        bookingReference: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        guest: {
          firstName: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      {
        guest: {
          surname: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      {
        guest: {
          phone: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      {
        guest: {
          email: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      {
        guest: {
          idNumber: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  if (filters.fromDate || filters.toDate) {
    where.checkInDate = {};

    if (filters.fromDate) {
      where.checkInDate.gte = new Date(`${filters.fromDate}T00:00:00.000Z`);
    }

    if (filters.toDate) {
      where.checkInDate.lte = new Date(`${filters.toDate}T23:59:59.999Z`);
    }
  }

  return prisma.booking.findMany({
    where,
    include: {
      branch: true,
      room: true,
      roomType: true,
      guest: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
}

export async function getBookingForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  bookingId: string,
) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      branch: true,
      room: true,
      roomType: true,
      guest: true,
      payment: true,
      auditLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!booking) {
    return null;
  }

  if (!canAccessBooking(adminUser, booking.branchId)) {
    return null;
  }

  return booking;
}

export async function confirmMockPaymentForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  bookingId: string,
  data: PaymentVerificationValues,
) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        payment: true,
      },
    });

    if (!booking || !booking.payment) {
      throw new Error("Booking payment could not be found.");
    }

    if (!canAccessBooking(adminUser, booking.branchId)) {
      throw new Error("You do not have access to manage this booking.");
    }

    if (booking.payment.id !== data.paymentId) {
      throw new Error("Payment details do not match this booking.");
    }

    if (booking.payment.method !== PaymentMethod.MOCK_ECOCASH) {
      throw new Error("Only mock EcoCash payments can be verified here.");
    }

    if (!["PAID", "FAILED", "REFUNDED"].includes(data.newStatus)) {
      throw new Error("Select a valid payment verification status.");
    }

    const paymentUpdate: Prisma.PaymentUpdateInput = {
      status: data.newStatus,
    };
    const bookingUpdate: Prisma.BookingUpdateInput = {
      paymentStatus: data.newStatus,
    };

    if (data.newStatus === PaymentStatus.PAID) {
      paymentUpdate.paidAt = new Date();
      paymentUpdate.transactionReference = data.transactionReference ?? null;
      paymentUpdate.failureReason = null;
    }

    if (data.newStatus === PaymentStatus.FAILED) {
      paymentUpdate.failureReason = data.note ?? "Marked as failed during manual verification.";
      paymentUpdate.paidAt = null;
    }

    if (data.newStatus === PaymentStatus.REFUNDED) {
      paymentUpdate.failureReason = data.note ?? null;
    }

    const payment = await tx.payment.update({
      where: {
        id: booking.payment.id,
      },
      data: paymentUpdate,
    });

    await tx.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        ...bookingUpdate,
        auditLogs: {
          create: {
            adminUserId: adminUser.id,
            action: AuditAction.PAYMENT_UPDATE,
            entity: "Payment",
            entityId: booking.payment.id,
            description: `Payment status updated from ${booking.payment.status} to ${data.newStatus}.`,
            metadata: {
              oldStatus: booking.payment.status,
              newStatus: data.newStatus,
              reason: data.note ?? null,
              transactionReference: data.transactionReference ?? null,
            },
          },
        },
      },
    });

    return payment;
  });
}

const normalTransitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED", "NO_SHOW"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["CHECKED_OUT"],
  CHECKED_OUT: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export async function updateBookingStatusForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  bookingId: string,
  newStatus: BookingStatus,
  reason?: string,
) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      throw new Error("Booking could not be found.");
    }

    if (!canAccessBooking(adminUser, booking.branchId)) {
      throw new Error("You do not have access to manage this booking.");
    }

    const canOverrideClosedStatus =
      adminUser.role === UserRole.SUPER_ADMIN &&
      ["CHECKED_OUT", "CANCELLED", "NO_SHOW"].includes(booking.status) &&
      Boolean(reason);

    if (!canOverrideClosedStatus && !normalTransitions[booking.status].includes(newStatus)) {
      throw new Error(`Booking cannot move from ${booking.status} to ${newStatus}.`);
    }

    if (
      booking.status !== newStatus &&
      ["CHECKED_OUT", "CANCELLED", "NO_SHOW"].includes(booking.status) &&
      !canOverrideClosedStatus
    ) {
      throw new Error("Only a super admin with a clear reason can change a closed booking state.");
    }

    if (newStatus === BookingStatus.CONFIRMED && booking.paymentStatus !== PaymentStatus.PAID) {
      throw new Error("Payment must be marked as paid before confirming this booking.");
    }

    const data: Prisma.BookingUpdateInput = {
      status: newStatus,
      auditLogs: {
        create: {
          adminUserId: adminUser.id,
          action: AuditAction.BOOKING_STATUS_CHANGE,
          entity: "Booking",
          entityId: booking.id,
          description: `Booking status updated from ${booking.status} to ${newStatus}.`,
          metadata: {
            oldStatus: booking.status,
            newStatus,
            reason: reason ?? null,
          },
        },
      },
    };

    if (newStatus === BookingStatus.CANCELLED) {
      data.cancelledAt = new Date();
      data.cancellationReason = reason ?? booking.cancellationReason ?? "Cancelled by admin.";
    }

    if (newStatus !== BookingStatus.CANCELLED && booking.status === BookingStatus.CANCELLED && adminUser.role === UserRole.SUPER_ADMIN) {
      data.cancelledAt = null;
      data.cancellationReason = null;
    }

    return tx.booking.update({
      where: {
        id: booking.id,
      },
      data,
      include: {
        branch: true,
        room: true,
        roomType: true,
        guest: true,
        payment: true,
      },
    });
  });
}

export async function cancelBookingForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  bookingId: string,
  reason: string,
) {
  const booking = await getBookingForAdmin(adminUser, bookingId);

  if (!booking) {
    throw new Error("Booking could not be found.");
  }

  if (
    booking.status !== BookingStatus.PENDING &&
    booking.status !== BookingStatus.CONFIRMED
  ) {
    throw new Error("Only pending or confirmed bookings can be cancelled.");
  }

  return updateBookingStatusForAdmin(adminUser, bookingId, BookingStatus.CANCELLED, reason);
}

export async function getBookingStatsForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
) {
  const accessWhere = buildAccessWhere(adminUser);

  if (accessWhere === null) {
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      checkedInBookings: 0,
      pendingPayments: 0,
      paidPayments: 0,
      todaysArrivals: 0,
      todaysCheckouts: 0,
    };
  }

  const today = startOfUtcDay();
  const tomorrow = endOfUtcDay();

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    checkedInBookings,
    pendingPayments,
    paidPayments,
    todaysArrivals,
    todaysCheckouts,
  ] = await Promise.all([
    prisma.booking.count({ where: accessWhere }),
    prisma.booking.count({ where: { ...accessWhere, status: BookingStatus.PENDING } }),
    prisma.booking.count({ where: { ...accessWhere, status: BookingStatus.CONFIRMED } }),
    prisma.booking.count({ where: { ...accessWhere, status: BookingStatus.CHECKED_IN } }),
    prisma.booking.count({ where: { ...accessWhere, paymentStatus: PaymentStatus.PENDING } }),
    prisma.booking.count({ where: { ...accessWhere, paymentStatus: PaymentStatus.PAID } }),
    prisma.booking.count({
      where: {
        ...accessWhere,
        checkInDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    prisma.booking.count({
      where: {
        ...accessWhere,
        checkOutDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
  ]);

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    checkedInBookings,
    pendingPayments,
    paidPayments,
    todaysArrivals,
    todaysCheckouts,
  };
}
