"use server";

import { ZodError } from "zod";
import { createGuestBooking } from "@/lib/bookings";
import {
  guestBookingSchema,
  type GuestBookingFormValues,
} from "@/lib/validations/booking";
import type { GuestBookingFormState } from "@/types";

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function getBooleanValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "true" || value === "on" || value === "1";
}

function getBookingValues(formData: FormData): GuestBookingFormValues {
  return {
    branchId: getStringValue(formData, "branchId"),
    roomTypeId: getStringValue(formData, "roomTypeId"),
    roomId: getStringValue(formData, "roomId"),
    checkInDate: getStringValue(formData, "checkInDate"),
    checkOutDate: getStringValue(formData, "checkOutDate"),
    expectedArrivalTime: getStringValue(formData, "expectedArrivalTime"),
    numberOfGuests: Number(formData.get("numberOfGuests") ?? 1),
    isBookingForTwo: getBooleanValue(formData, "isBookingForTwo"),
    firstName: getStringValue(formData, "firstName"),
    surname: getStringValue(formData, "surname"),
    idNumber: getStringValue(formData, "idNumber"),
    gender: getStringValue(formData, "gender") as GuestBookingFormValues["gender"],
    phone: getStringValue(formData, "phone"),
    email: getStringValue(formData, "email"),
    transportOption: getStringValue(
      formData,
      "transportOption",
    ) as GuestBookingFormValues["transportOption"],
    hasOwnCar: getBooleanValue(formData, "hasOwnCar"),
    needsParking: getBooleanValue(formData, "needsParking"),
    needsPickup: getBooleanValue(formData, "needsPickup"),
    pickupPoint: getStringValue(formData, "pickupPoint"),
    specialRequests: getStringValue(formData, "specialRequests"),
    roomTypeCapacity: Number(formData.get("roomTypeCapacity") ?? 0),
  };
}

export async function createGuestBookingAction(
  _state: GuestBookingFormState,
  formData: FormData,
): Promise<GuestBookingFormState> {
  const values = getBookingValues(formData);
  const parsed = guestBookingSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const booking = await createGuestBooking(parsed.data);

    return {
      success: true,
      message: "Booking created successfully.",
      bookingReference: booking.bookingReference,
      redirectTo: `/booking/payment/${booking.bookingReference}`,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Please correct the highlighted fields and try again.",
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Booking could not be created right now. Please try again.",
    };
  }
}
