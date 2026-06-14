import { z } from "zod";

function optionalTrimmedString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

const bookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
]);

const paymentStatusEnum = z.enum([
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);

export const bookingFilterSchema = z
  .object({
    branchId: z.preprocess(optionalTrimmedString, z.string().optional()),
    status: z.preprocess(optionalTrimmedString, bookingStatusEnum.optional()),
    paymentStatus: z.preprocess(optionalTrimmedString, paymentStatusEnum.optional()),
    search: z.preprocess(optionalTrimmedString, z.string().max(100).optional()),
    fromDate: z.preprocess(optionalTrimmedString, z.string().optional()),
    toDate: z.preprocess(optionalTrimmedString, z.string().optional()),
  })
  .superRefine((value, ctx) => {
    if (value.fromDate) {
      const fromDate = new Date(`${value.fromDate}T00:00:00.000Z`);

      if (Number.isNaN(fromDate.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid from date.",
          path: ["fromDate"],
        });
      }
    }

    if (value.toDate) {
      const toDate = new Date(`${value.toDate}T00:00:00.000Z`);

      if (Number.isNaN(toDate.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid to date.",
          path: ["toDate"],
        });
      }
    }

    if (value.fromDate && value.toDate) {
      const fromDate = new Date(`${value.fromDate}T00:00:00.000Z`);
      const toDate = new Date(`${value.toDate}T00:00:00.000Z`);

      if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime()) && toDate < fromDate) {
        ctx.addIssue({
          code: "custom",
          message: "To date cannot be before from date.",
          path: ["toDate"],
        });
      }
    }
  });

export const bookingStatusUpdateSchema = z.object({
  bookingId: z.string().min(1, "Booking is required."),
  status: bookingStatusEnum,
  reason: z.preprocess(optionalTrimmedString, z.string().max(300).optional()),
});

export const paymentVerificationSchema = z.object({
  bookingId: z.string().min(1, "Booking is required."),
  paymentId: z.string().min(1, "Payment is required."),
  newStatus: paymentStatusEnum,
  transactionReference: z.preprocess(
    optionalTrimmedString,
    z.string().max(100, "Transaction reference must not exceed 100 characters.").optional(),
  ),
  note: z.preprocess(
    optionalTrimmedString,
    z.string().max(300, "Note must not exceed 300 characters.").optional(),
  ),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking is required."),
  cancellationReason: z.string().trim().min(5, "Cancellation reason must be at least 5 characters.").max(300, "Cancellation reason must not exceed 300 characters."),
});

export type BookingFilterValues = z.infer<typeof bookingFilterSchema>;
export type BookingStatusUpdateValues = z.infer<typeof bookingStatusUpdateSchema>;
export type PaymentVerificationValues = z.infer<typeof paymentVerificationSchema>;
export type CancelBookingValues = z.infer<typeof cancelBookingSchema>;
