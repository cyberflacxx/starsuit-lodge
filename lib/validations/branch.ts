import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens only."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(1, "City is required."),
  phone: z.string().min(1, "Phone is required."),
  email: z.email("Enter a valid email address."),
  mapUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Enter a valid map URL or leave it empty.",
    }),
  isActive: z.boolean(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;
