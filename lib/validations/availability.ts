import { z } from "zod";

function parseDateValue(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export const availabilitySearchSchema = z
  .object({
    branchId: z.string().min(1, "Branch is required."),
    roomTypeId: z.string().optional().or(z.literal("")),
    checkInDate: z.string().min(1, "Check-in date is required."),
    checkOutDate: z.string().min(1, "Check-out date is required."),
    numberOfGuests: z.coerce
      .number()
      .int("Guests must be a whole number.")
      .min(1, "Guests must be at least 1.")
      .max(10, "Guests cannot exceed 10."),
  })
  .superRefine((value, ctx) => {
    const checkIn = parseDateValue(value.checkInDate);
    const checkOut = parseDateValue(value.checkOutDate);
    const today = todayUtc();

    if (Number.isNaN(checkIn.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid check-in date.",
        path: ["checkInDate"],
      });
    }

    if (Number.isNaN(checkOut.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid check-out date.",
        path: ["checkOutDate"],
      });
    }

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      return;
    }

    if (checkIn < today) {
      ctx.addIssue({
        code: "custom",
        message: "Check-in date must be today or later.",
        path: ["checkInDate"],
      });
    }

    if (checkOut <= checkIn) {
      ctx.addIssue({
        code: "custom",
        message: "Check-out date must be after check-in date.",
        path: ["checkOutDate"],
      });
    }

    const nightCount = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);

    if (nightCount < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Stay length must be at least 1 night.",
        path: ["checkOutDate"],
      });
    }

    if (nightCount > 30) {
      ctx.addIssue({
        code: "custom",
        message: "Stay length must not exceed 30 nights.",
        path: ["checkOutDate"],
      });
    }
  });

export type AvailabilitySearchValues = z.infer<typeof availabilitySearchSchema>;
