"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createContentBlockForAdmin,
  createGalleryImageForAdmin,
  createServiceForAdmin,
  deleteGalleryImageForAdmin,
  updateContentBlockForAdmin,
  updateGalleryImageForAdmin,
  updateServiceForAdmin,
} from "@/lib/admin/content";
import {
  contentBlockSchema,
  galleryImageSchema,
  serviceSchema,
} from "@/lib/validations/content";

type ContentActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function revalidateContentPaths() {
  [
    "/",
    "/about",
    "/branches",
    "/rooms",
    "/gallery",
    "/contact",
    "/booking",
    "/admin/content",
  ].forEach((path) => revalidatePath(path));
}

function errorState(message: string, errors?: Record<string, string[]>) {
  return {
    success: false,
    message,
    errors,
  } satisfies ContentActionState;
}

export async function createContentBlockAction(
  _state: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const adminUser = await requireAdmin();
  const parsed = contentBlockSchema.safeParse({
    key: String(formData.get("key") ?? ""),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    branchId: formData.get("branchId"),
    status: String(formData.get("status") ?? ""),
  });

  if (!parsed.success) {
    return errorState(
      "Please correct the highlighted fields and try again.",
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  try {
    await createContentBlockForAdmin(adminUser, parsed.data);
    revalidateContentPaths();
    return { success: true, message: "Content block created successfully." };
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Content block could not be created.");
  }
}

export async function updateContentBlockAction(
  _state: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = contentBlockSchema.safeParse({
    key: String(formData.get("key") ?? ""),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    branchId: formData.get("branchId"),
    status: String(formData.get("status") ?? ""),
  });

  if (!parsed.success) {
    return errorState(
      "Please correct the highlighted fields and try again.",
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  try {
    await updateContentBlockForAdmin(adminUser, id, parsed.data);
    revalidateContentPaths();
    return { success: true, message: "Content block updated successfully." };
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Content block could not be updated.");
  }
}

export async function createServiceAction(
  _state: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const adminUser = await requireAdmin();
  const parsed = serviceSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    iconName: String(formData.get("iconName") ?? ""),
    branchId: formData.get("branchId"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return errorState(
      "Please correct the highlighted fields and try again.",
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  try {
    await createServiceForAdmin(adminUser, parsed.data);
    revalidateContentPaths();
    return { success: true, message: "Service created successfully." };
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Service could not be created.");
  }
}

export async function updateServiceAction(
  _state: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = serviceSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    iconName: String(formData.get("iconName") ?? ""),
    branchId: formData.get("branchId"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return errorState(
      "Please correct the highlighted fields and try again.",
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  try {
    await updateServiceForAdmin(adminUser, id, parsed.data);
    revalidateContentPaths();
    return { success: true, message: "Service updated successfully." };
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Service could not be updated.");
  }
}

export async function createGalleryImageAction(
  _state: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const adminUser = await requireAdmin();
  const parsed = galleryImageSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    altText: String(formData.get("altText") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    branchId: formData.get("branchId"),
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return errorState(
      "Please correct the highlighted fields and try again.",
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  try {
    await createGalleryImageForAdmin(adminUser, parsed.data);
    revalidateContentPaths();
    return { success: true, message: "Gallery image created successfully." };
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Gallery image could not be created.");
  }
}

export async function updateGalleryImageAction(
  _state: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = galleryImageSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    altText: String(formData.get("altText") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    branchId: formData.get("branchId"),
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return errorState(
      "Please correct the highlighted fields and try again.",
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  try {
    await updateGalleryImageForAdmin(adminUser, id, parsed.data);
    revalidateContentPaths();
    return { success: true, message: "Gallery image updated successfully." };
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Gallery image could not be updated.");
  }
}

export async function deleteGalleryImageAction(
  _state: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  try {
    await deleteGalleryImageForAdmin(adminUser, id);
    revalidateContentPaths();
    return { success: true, message: "Gallery image disabled successfully." };
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Gallery image could not be disabled.");
  }
}

export async function submitDeleteGalleryImageAction(formData: FormData): Promise<void> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  await deleteGalleryImageForAdmin(adminUser, id);
  revalidateContentPaths();
}
