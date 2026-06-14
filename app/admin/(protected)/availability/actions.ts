"use server";

import { availabilitySearchSchema, type AvailabilitySearchValues } from "@/lib/validations/availability";
import { getAvailabilitySummary } from "@/lib/availability";
import { requireAdmin } from "@/lib/auth";
import type { AvailabilitySearchState } from "@/types";

export async function checkAdminAvailabilityAction(
  _state: AvailabilitySearchState,
  formData: FormData,
): Promise<AvailabilitySearchState> {
  const adminUser = await requireAdmin();

  const rawValues = {
    branchId: String(formData.get("branchId") ?? ""),
    roomTypeId: String(formData.get("roomTypeId") ?? ""),
    checkInDate: String(formData.get("checkInDate") ?? ""),
    checkOutDate: String(formData.get("checkOutDate") ?? ""),
    numberOfGuests: formData.get("numberOfGuests"),
  };

  const parsed = availabilitySearchSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors as Partial<
        Record<keyof AvailabilitySearchValues, string[]>
      >,
    };
  }

  if (adminUser.role !== "SUPER_ADMIN" && adminUser.branchId !== parsed.data.branchId) {
    return {
      success: false,
      message: "You do not have access to check availability for that branch.",
    };
  }

  try {
    const summary = await getAvailabilitySummary(parsed.data);

    return {
      success: true,
      message: summary.message,
      data: summary,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Availability check failed. Please try again.",
    };
  }
}
