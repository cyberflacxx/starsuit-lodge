import "server-only";

import { AuditAction, BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { notifyMockPaymentSubmitted } from "@/lib/notifications/notification-service";
import { prisma } from "@/lib/prisma";
import {
  mockPaymentConfirmationSchema,
  type MockPaymentConfirmationValues,
} from "@/lib/validations/payment";

export async function getPaymentBookingByReference(reference: string) {
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
          phone: true,
          email: true,
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
      payment: {
        select: {
          id: true,
          method: true,
          status: true,
          amount: true,
          currency: true,
          transactionReference: true,
          providerReference: true,
          paidAt: true,
          failureReason: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

export async function markMockPaymentPending(rawValues: MockPaymentConfirmationValues) {
  const values = mockPaymentConfirmationSchema.parse(rawValues);

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: {
        bookingReference: values.bookingReference,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
            phone: true,
            email: true,
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
        payment: {
          select: {
            id: true,
            method: true,
            status: true,
            amount: true,
            currency: true,
            providerReference: true,
            paidAt: true,
            failureReason: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!booking || !booking.payment) {
      throw new Error("This booking payment could not be found.");
    }

    if (booking.payment.id !== values.paymentId) {
      throw new Error("Payment details do not match this booking.");
    }

    if (booking.payment.method !== PaymentMethod.MOCK_ECOCASH) {
      throw new Error("This booking does not use mock EcoCash payment.");
    }

    if (booking.payment.status === PaymentStatus.PAID) {
      throw new Error("This booking is already marked as paid.");
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error("Cancelled bookings cannot be updated for payment confirmation.");
    }

    const payment = await tx.payment.update({
      where: {
        id: booking.payment.id,
      },
      data: {
        status: PaymentStatus.PENDING,
        providerReference: "MOCK-ECOCASH-USSD",
        failureReason: null,
      },
      select: {
        id: true,
        method: true,
        status: true,
        amount: true,
        currency: true,
        providerReference: true,
        paidAt: true,
        failureReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const updatedBooking = await tx.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        paymentStatus: PaymentStatus.PENDING,
        auditLogs: {
          create: {
            action: AuditAction.PAYMENT_UPDATE,
            entity: "Payment",
            entityId: booking.payment.id,
            description: "Guest submitted mock EcoCash payment confirmation",
            metadata: {
              bookingReference: booking.bookingReference,
              payerPhone: values.payerPhone ?? null,
              confirmationNote: values.confirmationNote ?? null,
            },
          },
        },
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
            phone: true,
            email: true,
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

    return {
      booking: updatedBooking,
      payment,
    };
  });

  void notifyMockPaymentSubmitted(result.booking.bookingReference).then((results) => {
    results
      .filter((item) => !item.success)
      .forEach((item) => console.error("Payment submitted notification failed:", item.message));
  });

  return result;
}
