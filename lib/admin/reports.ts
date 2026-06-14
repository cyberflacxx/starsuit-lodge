import "server-only";

import {
  BookingStatus,
  PaymentStatus,
  Prisma,
  RoomStatus,
  UserRole,
} from "@prisma/client";
import type { AuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatReportDateLabel,
  getDateBuckets,
  normaliseReportDateRange,
} from "@/lib/reports/date-ranges";
import type { ReportFilterValues } from "@/lib/validations/reports";

type ReportAdminUser = Pick<
  AuthenticatedAdmin,
  "id" | "role" | "branchId" | "branch"
>;

type ReportScope = {
  branchIds: string[] | null;
  selectedBranchId: string | null;
  dateRange: ReturnType<typeof normaliseReportDateRange>;
  scopeLabel: string;
};

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    branch: true;
    room: true;
    roomType: true;
    guest: true;
    payment: true;
  };
}>;

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function nextUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
}

function moneyToNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

function buildBranchWhere(branchIds: string[] | null): Prisma.BookingWhereInput {
  if (branchIds === null) {
    return {};
  }

  return {
    branchId: {
      in: branchIds,
    },
  };
}

function buildRoomWhere(branchIds: string[] | null): Prisma.RoomWhereInput {
  if (branchIds === null) {
    return {
      isActive: true,
    };
  }

  return {
    isActive: true,
    branchId: {
      in: branchIds,
    },
  };
}

function isBookingWithinDateRange(
  booking: Pick<BookingWithRelations, "checkInDate" | "checkOutDate">,
  fromDate: Date,
  toDate: Date,
) {
  return booking.checkInDate <= toDate && booking.checkOutDate >= fromDate;
}

function incrementBucket<
  T extends {
    date: string;
  },
>(map: Map<string, T>, key: string, create: () => T) {
  const existing = map.get(key);

  if (existing) {
    return existing;
  }

  const next = create();
  map.set(key, next);
  return next;
}

async function getScopedBookings(scope: ReportScope) {
  return prisma.booking.findMany({
    where: buildBranchWhere(scope.branchIds),
    include: {
      branch: true,
      room: true,
      roomType: true,
      guest: true,
      payment: true,
    },
    orderBy: {
      checkInDate: "asc",
    },
  });
}

async function getActiveRooms(scope: ReportScope) {
  return prisma.room.findMany({
    where: buildRoomWhere(scope.branchIds),
    include: {
      branch: true,
      roomType: true,
    },
    orderBy: [{ branch: { name: "asc" } }, { roomNumber: "asc" }],
  });
}

function filterBookingsForRange(bookings: BookingWithRelations[], scope: ReportScope) {
  return bookings.filter((booking) =>
    isBookingWithinDateRange(booking, scope.dateRange.fromDate, scope.dateRange.toDate),
  );
}

export async function getReportScopeForAdmin(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
): Promise<ReportScope> {
  const dateRange = normaliseReportDateRange(filters);

  if (adminUser.role === UserRole.SUPER_ADMIN) {
    if (!filters.branchId) {
      return {
        branchIds: null,
        selectedBranchId: null,
        dateRange,
        scopeLabel: "All branches",
      };
    }

    const branch = await prisma.branch.findUnique({
      where: { id: filters.branchId },
      select: { id: true, name: true },
    });

    if (!branch) {
      return {
        branchIds: null,
        selectedBranchId: null,
        dateRange,
        scopeLabel: "All branches",
      };
    }

    return {
      branchIds: [branch.id],
      selectedBranchId: branch.id,
      dateRange,
      scopeLabel: branch.name,
    };
  }

  if (!adminUser.branchId || !adminUser.branch) {
    return {
      branchIds: [],
      selectedBranchId: null,
      dateRange,
      scopeLabel: "No branch assigned",
    };
  }

  return {
    branchIds: [adminUser.branchId],
    selectedBranchId: adminUser.branchId,
    dateRange,
    scopeLabel: adminUser.branch.name,
  };
}

export async function getDashboardOverview(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters);
  const [bookings, rooms] = await Promise.all([getScopedBookings(scope), getActiveRooms(scope)]);
  const rangeBookings = filterBookingsForRange(bookings, scope);

  const totalBookings = rangeBookings.length;
  const pendingBookings = rangeBookings.filter((booking) => booking.status === BookingStatus.PENDING).length;
  const confirmedBookings = rangeBookings.filter((booking) => booking.status === BookingStatus.CONFIRMED).length;
  const checkedInBookings = rangeBookings.filter((booking) => booking.status === BookingStatus.CHECKED_IN).length;
  const cancelledBookings = rangeBookings.filter((booking) => booking.status === BookingStatus.CANCELLED).length;
  const noShowBookings = rangeBookings.filter((booking) => booking.status === BookingStatus.NO_SHOW).length;

  const totalRevenue = rangeBookings
    .filter((booking) => booking.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, booking) => sum + moneyToNumber(booking.totalAmount), 0);
  const pendingRevenue = rangeBookings
    .filter((booking) => booking.paymentStatus === PaymentStatus.PENDING)
    .reduce((sum, booking) => sum + moneyToNumber(booking.totalAmount), 0);
  const paidRevenue = totalRevenue;
  const unpaidRevenue = rangeBookings
    .filter((booking) => booking.paymentStatus === PaymentStatus.UNPAID)
    .reduce((sum, booking) => sum + moneyToNumber(booking.totalAmount), 0);

  const eligibleRooms = rooms.filter((room) => room.status !== RoomStatus.BLOCKED);
  const occupiedRoomIds = new Set(
    rangeBookings
      .filter((booking) =>
        booking.roomId &&
        (booking.status === BookingStatus.CONFIRMED ||
          booking.status === BookingStatus.CHECKED_IN),
      )
      .map((booking) => booking.roomId as string),
  );
  const occupancyRate = eligibleRooms.length
    ? (occupiedRoomIds.size / eligibleRooms.length) * 100
    : 0;

  const availableRooms = rooms.filter((room) => room.status === RoomStatus.AVAILABLE).length;
  const occupiedRooms = rooms.filter((room) => room.status === RoomStatus.OCCUPIED).length;
  const maintenanceRooms = rooms.filter((room) => room.status === RoomStatus.MAINTENANCE).length;
  const pendingPayments = rangeBookings.filter((booking) => booking.paymentStatus === PaymentStatus.PENDING).length;
  const paidPayments = rangeBookings.filter((booking) => booking.paymentStatus === PaymentStatus.PAID).length;

  const todayStart = startOfUtcDay();
  const tomorrow = nextUtcDay();
  const todaysArrivals = bookings.filter(
    (booking) => booking.checkInDate >= todayStart && booking.checkInDate < tomorrow,
  ).length;
  const todaysCheckouts = bookings.filter(
    (booking) => booking.checkOutDate >= todayStart && booking.checkOutDate < tomorrow,
  ).length;

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    checkedInBookings,
    cancelledBookings,
    noShowBookings,
    totalRevenue,
    pendingRevenue,
    paidRevenue,
    unpaidRevenue,
    occupancyRate,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    pendingPayments,
    paidPayments,
    todaysArrivals,
    todaysCheckouts,
    scope,
  };
}

export async function getBookingTrend(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters);
  const bookings = filterBookingsForRange(await getScopedBookings(scope), scope);
  const bucketMap = new Map(
    getDateBuckets(scope.dateRange.fromDate, scope.dateRange.toDate).map((date) => [
      date,
      {
        date,
        label: formatReportDateLabel(new Date(`${date}T00:00:00.000Z`)),
        bookings: 0,
        confirmed: 0,
        cancelled: 0,
      },
    ]),
  );

  for (const booking of bookings) {
    const key = booking.checkInDate.toISOString().slice(0, 10);
    const bucket = incrementBucket(bucketMap, key, () => ({
      date: key,
      label: formatReportDateLabel(new Date(`${key}T00:00:00.000Z`)),
      bookings: 0,
      confirmed: 0,
      cancelled: 0,
    }));

    bucket.bookings += 1;

    if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.CHECKED_IN) {
      bucket.confirmed += 1;
    }

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.NO_SHOW) {
      bucket.cancelled += 1;
    }
  }

  return Array.from(bucketMap.values()).sort((left, right) => left.date.localeCompare(right.date));
}

export async function getRevenueTrend(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters);
  const bookings = filterBookingsForRange(await getScopedBookings(scope), scope);
  const bucketMap = new Map(
    getDateBuckets(scope.dateRange.fromDate, scope.dateRange.toDate).map((date) => [
      date,
      {
        date,
        label: formatReportDateLabel(new Date(`${date}T00:00:00.000Z`)),
        paidRevenue: 0,
        pendingRevenue: 0,
      },
    ]),
  );

  for (const booking of bookings) {
    const key = booking.checkInDate.toISOString().slice(0, 10);
    const bucket = incrementBucket(bucketMap, key, () => ({
      date: key,
      label: formatReportDateLabel(new Date(`${key}T00:00:00.000Z`)),
      paidRevenue: 0,
      pendingRevenue: 0,
    }));
    const amount = moneyToNumber(booking.totalAmount);

    if (booking.paymentStatus === PaymentStatus.PAID) {
      bucket.paidRevenue += amount;
    }

    if (booking.paymentStatus === PaymentStatus.PENDING) {
      bucket.pendingRevenue += amount;
    }
  }

  return Array.from(bucketMap.values()).sort((left, right) => left.date.localeCompare(right.date));
}

export async function getPaymentSummary(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters);
  const bookings = filterBookingsForRange(await getScopedBookings(scope), scope);
  const statuses: PaymentStatus[] = [
    PaymentStatus.UNPAID,
    PaymentStatus.PENDING,
    PaymentStatus.PAID,
    PaymentStatus.FAILED,
    PaymentStatus.REFUNDED,
  ];

  return statuses.map((status) => {
    const statusBookings = bookings.filter((booking) => booking.paymentStatus === status);
    return {
      status,
      count: statusBookings.length,
      amount: statusBookings.reduce((sum, booking) => sum + moneyToNumber(booking.totalAmount), 0),
    };
  });
}

export async function getRoomPerformance(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters);
  const [bookings, rooms] = await Promise.all([getScopedBookings(scope), getActiveRooms(scope)]);
  const rangeBookings = filterBookingsForRange(bookings, scope);

  return rooms.map((room) => {
    const roomBookings = rangeBookings.filter((booking) => booking.roomId === room.id);
    const paidBookings = roomBookings.filter((booking) => booking.paymentStatus === PaymentStatus.PAID);
    const occupancyCount = roomBookings.filter(
      (booking) =>
        booking.status === BookingStatus.CONFIRMED ||
        booking.status === BookingStatus.CHECKED_IN ||
        booking.status === BookingStatus.CHECKED_OUT,
    ).length;

    return {
      roomId: room.id,
      roomNumber: room.roomNumber,
      branchName: room.branch.name,
      roomTypeName: room.roomType.name,
      bookings: roomBookings.length,
      revenue: paidBookings.reduce((sum, booking) => sum + moneyToNumber(booking.totalAmount), 0),
      occupancyCount,
    };
  });
}

export async function getBranchPerformance(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters);
  const [branches, bookings, rooms] = await Promise.all([
    prisma.branch.findMany({
      where: scope.branchIds?.length ? { id: { in: scope.branchIds } } : undefined,
      orderBy: { name: "asc" },
    }),
    getScopedBookings(scope),
    getActiveRooms(scope),
  ]);
  const rangeBookings = filterBookingsForRange(bookings, scope);

  return branches.map((branch) => {
    const branchBookings = rangeBookings.filter((booking) => booking.branchId === branch.id);
    const branchRooms = rooms.filter(
      (room) => room.branchId === branch.id && room.status !== RoomStatus.BLOCKED,
    );
    const occupiedRoomIds = new Set(
      branchBookings
        .filter((booking) =>
          booking.roomId &&
          (booking.status === BookingStatus.CONFIRMED ||
            booking.status === BookingStatus.CHECKED_IN),
        )
        .map((booking) => booking.roomId as string),
    );

    return {
      branchId: branch.id,
      branchName: branch.name,
      city: branch.city,
      bookings: branchBookings.length,
      confirmedBookings: branchBookings.filter(
        (booking) =>
          booking.status === BookingStatus.CONFIRMED ||
          booking.status === BookingStatus.CHECKED_IN,
      ).length,
      paidRevenue: branchBookings
        .filter((booking) => booking.paymentStatus === PaymentStatus.PAID)
        .reduce((sum, booking) => sum + moneyToNumber(booking.totalAmount), 0),
      pendingPayments: branchBookings.filter((booking) => booking.paymentStatus === PaymentStatus.PENDING).length,
      occupancyRate: branchRooms.length ? (occupiedRoomIds.size / branchRooms.length) * 100 : 0,
    };
  });
}

export async function getTodayOperations(
  adminUser: ReportAdminUser,
  filters?: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters ?? { preset: "TODAY" });
  const bookings = await getScopedBookings(scope);
  const todayStart = startOfUtcDay();
  const tomorrow = nextUtcDay();

  const mapBooking = (booking: BookingWithRelations) => ({
    bookingReference: booking.bookingReference,
    guestName: `${booking.guest.firstName} ${booking.guest.surname}`,
    phone: booking.guest.phone,
    branch: booking.branch.name,
    room: booking.room?.roomNumber ?? "Unassigned",
    expectedArrivalTime: booking.expectedArrivalTime,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
  });

  return {
    arrivals: bookings
      .filter((booking) => booking.checkInDate >= todayStart && booking.checkInDate < tomorrow)
      .map(mapBooking),
    checkouts: bookings
      .filter((booking) => booking.checkOutDate >= todayStart && booking.checkOutDate < tomorrow)
      .map(mapBooking),
    pendingPayments: bookings
      .filter((booking) => booking.paymentStatus === PaymentStatus.PENDING)
      .map(mapBooking),
    currentlyCheckedIn: bookings
      .filter((booking) => booking.status === BookingStatus.CHECKED_IN)
      .map(mapBooking),
  };
}

export async function getBookingsReportRows(
  adminUser: ReportAdminUser,
  filters: ReportFilterValues,
) {
  const scope = await getReportScopeForAdmin(adminUser, filters);
  const bookings = filterBookingsForRange(await getScopedBookings(scope), scope);

  return bookings.map((booking) => ({
    bookingReference: booking.bookingReference,
    guestName: `${booking.guest.firstName} ${booking.guest.surname}`,
    phone: booking.guest.phone,
    branch: booking.branch.name,
    room: booking.room?.roomNumber ?? "Unassigned",
    checkInDate: booking.checkInDate.toISOString().slice(0, 10),
    checkOutDate: booking.checkOutDate.toISOString().slice(0, 10),
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    totalAmount: moneyToNumber(booking.totalAmount).toFixed(2),
  }));
}
