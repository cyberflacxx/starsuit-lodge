"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { getBranchForAdmin, updateBranchForAdmin } from "@/lib/admin/branches";
import { getPublicBranchPath } from "@/lib/branch-utils";
import { branchSchema, type BranchFormValues } from "@/lib/validations/branch";

export type BranchFormState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof BranchFormValues, string[]>>;
};

export async function updateBranchAction(
  branchId: string,
  _state: BranchFormState,
  formData: FormData,
): Promise<BranchFormState> {
  const adminUser = await requireAdmin();

  const rawValues = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    mapUrl: String(formData.get("mapUrl") ?? ""),
    isActive: formData.get("isActive") === "on",
  };

  const parsed = branchSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const existingBranch = await getBranchForAdmin(adminUser, branchId);

    if (!existingBranch) {
      return {
        success: false,
        message: "Branch not found or you do not have access to it.",
      };
    }

    if (adminUser.role === UserRole.RECEPTIONIST) {
      return {
        success: false,
        message: "Receptionists can view branch details but cannot edit them.",
      };
    }

    await updateBranchForAdmin(adminUser, branchId, parsed.data);

    revalidatePath("/");
    revalidatePath("/branches");
    revalidatePath(getPublicBranchPath(existingBranch));
    revalidatePath("/contact");
    revalidatePath("/admin/branches");

    if (existingBranch.slug !== parsed.data.slug || existingBranch.city !== parsed.data.city) {
      revalidatePath(getPublicBranchPath(parsed.data));
    }

    return {
      success: true,
      message: "Branch details saved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Branch update failed. Please try again.",
    };
  }
}
