import { z } from "zod";

function optionalBranchId(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function checkboxValue(value: unknown) {
  return value === true || value === "true" || value === "on" || value === "1";
}

export const contentBlockSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[a-z0-9_-]+$/, "Use lowercase letters, numbers, hyphens, and underscores only."),
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  body: z.string().trim().min(10, "Body must be at least 10 characters."),
  branchId: z.preprocess(optionalBranchId, z.string().nullable().optional()),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z.string().trim().min(10, "Description must be at least 10 characters."),
  iconName: z.string().trim().optional().or(z.literal("")),
  branchId: z.preprocess(optionalBranchId, z.string().nullable().optional()),
  isActive: z.preprocess(checkboxValue, z.boolean()),
});

export const galleryImageSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  altText: z.string().trim().min(5, "Alt text must be at least 5 characters."),
  imageUrl: z.string().trim().url("Enter a valid image URL."),
  branchId: z.preprocess(optionalBranchId, z.string().nullable().optional()),
  sortOrder: z.coerce.number().int().min(0, "Sort order must be 0 or higher."),
  isFeatured: z.preprocess(checkboxValue, z.boolean()),
  isActive: z.preprocess(checkboxValue, z.boolean()),
});

export type ContentBlockFormValues = z.infer<typeof contentBlockSchema>;
export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type GalleryImageFormValues = z.infer<typeof galleryImageSchema>;
