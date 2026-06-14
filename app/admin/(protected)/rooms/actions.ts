"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import {
  createMaintenanceBlockForAdmin,
  createRoomForAdmin,
  createRoomTypeForAdmin,
  removeMaintenanceBlockForAdmin,
  updateRoomForAdmin,
  updateRoomTypeForAdmin,
} from "@/lib/admin/rooms";
import {
  maintenanceBlockSchema,
  roomSchema,
  roomTypeSchema,
  type MaintenanceBlockFormValues,
  type RoomFormValues,
  type RoomTypeFormValues,
} from "@/lib/validations/room";

export type RoomActionState<T extends object> = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof T, string[]>>;
};

function revalidateRoomPaths() {
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  revalidatePath("/");
  revalidatePath("/booking");
}

export async function createRoomTypeAction(
  _state: RoomActionState<RoomTypeFormValues>,
  formData: FormData,
): Promise<RoomActionState<RoomTypeFormValues>> {
  const adminUser = await requireAdmin();

  const parsed = roomTypeSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    basePrice: formData.get("basePrice"),
    capacity: formData.get("capacity"),
    bedType: String(formData.get("bedType") ?? ""),
    amenities: String(formData.get("amenities") ?? ""),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (adminUser.role !== UserRole.SUPER_ADMIN) {
    return {
      success: false,
      message: "Only super admins can create room types.",
    };
  }

  try {
    await createRoomTypeForAdmin(adminUser, parsed.data);
    revalidateRoomPaths();

    return {
      success: true,
      message: "Room type created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Room type creation failed.",
    };
  }
}

export async function updateRoomTypeAction(
  roomTypeId: string,
  _state: RoomActionState<RoomTypeFormValues>,
  formData: FormData,
): Promise<RoomActionState<RoomTypeFormValues>> {
  const adminUser = await requireAdmin();

  const parsed = roomTypeSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    basePrice: formData.get("basePrice"),
    capacity: formData.get("capacity"),
    bedType: String(formData.get("bedType") ?? ""),
    amenities: String(formData.get("amenities") ?? ""),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateRoomTypeForAdmin(adminUser, roomTypeId, parsed.data);
    revalidateRoomPaths();

    return {
      success: true,
      message: "Room type updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Room type update failed.",
    };
  }
}

export async function createRoomAction(
  _state: RoomActionState<RoomFormValues>,
  formData: FormData,
): Promise<RoomActionState<RoomFormValues>> {
  const adminUser = await requireAdmin();

  const parsed = roomSchema.safeParse({
    branchId: String(formData.get("branchId") ?? ""),
    roomTypeId: String(formData.get("roomTypeId") ?? ""),
    roomNumber: String(formData.get("roomNumber") ?? ""),
    floor: formData.get("floor"),
    status: String(formData.get("status") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createRoomForAdmin(adminUser, parsed.data);
    revalidateRoomPaths();

    return {
      success: true,
      message: "Room created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Room creation failed.",
    };
  }
}

export async function updateRoomAction(
  roomId: string,
  _state: RoomActionState<RoomFormValues>,
  formData: FormData,
): Promise<RoomActionState<RoomFormValues>> {
  const adminUser = await requireAdmin();

  const parsed = roomSchema.safeParse({
    branchId: String(formData.get("branchId") ?? ""),
    roomTypeId: String(formData.get("roomTypeId") ?? ""),
    roomNumber: String(formData.get("roomNumber") ?? ""),
    floor: formData.get("floor"),
    status: String(formData.get("status") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateRoomForAdmin(adminUser, roomId, parsed.data);
    revalidateRoomPaths();

    return {
      success: true,
      message: "Room updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Room update failed.",
    };
  }
}

export async function createMaintenanceBlockAction(
  _state: RoomActionState<MaintenanceBlockFormValues>,
  formData: FormData,
): Promise<RoomActionState<MaintenanceBlockFormValues>> {
  const adminUser = await requireAdmin();

  const parsed = maintenanceBlockSchema.safeParse({
    roomId: String(formData.get("roomId") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createMaintenanceBlockForAdmin(adminUser, parsed.data);
    revalidateRoomPaths();

    return {
      success: true,
      message: "Maintenance block created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Maintenance block creation failed.",
    };
  }
}

export async function removeMaintenanceBlockAction(blockId: string) {
  const adminUser = await requireAdmin();

  try {
    await removeMaintenanceBlockForAdmin(adminUser, blockId);
    revalidateRoomPaths();

    return {
      success: true,
      message: "Maintenance block removed successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Maintenance block removal failed.",
    };
  }
}
