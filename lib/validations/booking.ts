import { z } from "zod";

function parseDateValue(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function booleanFromFormValue(value: unknown) {
  return value === true || value === "true" || value === "on" || value === 1 || value === "1";
}

function optionalTrimmedString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export const guestBookingSchema = z
  .object({
    branchId: z.string().min(1, "Branch is required."),
    roomTypeId: z.string().min(1, "Room type is required."),
    roomId: z.string().min(1, "Please select a room."),
    checkInDate: z.string().min(1, "Check-in date is required."),
    checkOutDate: z.string().min(1, "Check-out date is required."),
    expectedArrivalTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter a valid arrival time."),
    numberOfGuests: z.coerce
      .number()
      .int("Guests must be a whole number.")
      .min(1, "Guests must be at least 1.")
      .max(2, "Only up to 2 guests are supported right now."),
    isBookingForTwo: z.preprocess(booleanFromFormValue, z.boolean()),
    firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
    surname: z.string().trim().min(2, "Surname must be at least 2 characters."),
    idNumber: z.string().trim().min(5, "ID or passport number must be at least 5 characters."),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    phone: z.string().trim().min(7, "Phone number must be at least 7 characters."),
    email: z.string().trim().email("Enter a valid email address."),
    transportOption: z.enum(["OWN_CAR", "NEED_PICKUP", "NO_TRANSPORT_SUPPORT"]),
    hasOwnCar: z.preprocess(booleanFromFormValue, z.boolean()),
    needsParking: z.preprocess(booleanFromFormValue, z.boolean()),
    needsPickup: z.preprocess(booleanFromFormValue, z.boolean()),
    pickupPoint: z.preprocess(optionalTrimmedString, z.string().min(2).optional()),
    specialRequests: z.preprocess(optionalTrimmedString, z.string().max(500).optional()),
    roomTypeCapacity: z.preprocess(
      (value) => {
        if (value === null || value === undefined || value === "") {
          return undefined;
        }

        return value;
      },
      z.coerce.number().int().min(1).max(10).optional(),
    ),
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

    if (!Number.isNaN(checkIn.getTime()) && checkIn < today) {
      ctx.addIssue({
        code: "custom",
        message: "Check-in date must be today or later.",
        path: ["checkInDate"],
      });
    }

    if (!Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime())) {
      if (checkOut <= checkIn) {
        ctx.addIssue({
          code: "custom",
          message: "Check-out date must be after check-in date.",
          path: ["checkOutDate"],
        });
      }

      const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);

      if (nights < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Stay length must be at least 1 night.",
          path: ["checkOutDate"],
        });
      }

      if (nights > 30) {
        ctx.addIssue({
          code: "custom",
          message: "Stay length must not exceed 30 nights.",
          path: ["checkOutDate"],
        });
      }
    }

    if (value.roomTypeCapacity && value.numberOfGuests > value.roomTypeCapacity) {
      ctx.addIssue({
        code: "custom",
        message: `This room only allows up to ${value.roomTypeCapacity} guest${value.roomTypeCapacity === 1 ? "" : "s"}.`,
        path: ["numberOfGuests"],
      });
    }

    if ((value.needsPickup || value.transportOption === "NEED_PICKUP") && !value.pickupPoint) {
      ctx.addIssue({
        code: "custom",
        message: "Pickup point is required when pickup is needed.",
        path: ["pickupPoint"],
      });
    }

    if (value.needsParking && !value.hasOwnCar) {
      ctx.addIssue({
        code: "custom",
        message: "Parking can only be requested when you have your own car.",
        path: ["needsParking"],
      });
    }

    if (value.transportOption === "OWN_CAR" && !value.hasOwnCar) {
      ctx.addIssue({
        code: "custom",
        message: "Own car bookings must indicate that you have your own car.",
        path: ["hasOwnCar"],
      });
    }

    if (value.transportOption === "NEED_PICKUP" && !value.needsPickup) {
      ctx.addIssue({
        code: "custom",
        message: "Pickup bookings must confirm that pickup is needed.",
        path: ["needsPickup"],
      });
    }

    if (value.numberOfGuests === 2 && !value.isBookingForTwo) {
      ctx.addIssue({
        code: "custom",
        message: "Two-guest bookings must be marked as a booking for two guests.",
        path: ["isBookingForTwo"],
      });
    }
  });

export type GuestBookingFormValues = z.infer<typeof guestBookingSchema>;
