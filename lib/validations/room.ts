import { RoomStatus } from "@prisma/client";
import { z } from "zod";

const amenitiesSchema = z
  .union([z.array(z.string()), z.string()])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value.map((item) => item.trim()).filter(Boolean);
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  });

export const roomTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens only."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  basePrice: z.coerce.number().gt(0, "Base price must be greater than 0."),
  capacity: z
    .coerce
    .number()
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1.")
    .max(10, "Capacity cannot exceed 10."),
  bedType: z.string().min(1, "Bed type is required."),
  amenities: amenitiesSchema,
  isActive: z.boolean(),
});

export const roomSchema = z.object({
  branchId: z.string().min(1, "Branch is required."),
  roomTypeId: z.string().min(1, "Room type is required."),
  roomNumber: z.string().min(1, "Room number is required."),
  floor: z
    .union([z.coerce.number().int("Floor must be a whole number."), z.nan(), z.literal("")])
    .transform((value) => (value === "" || Number.isNaN(value) ? undefined : value))
    .optional(),
  status: z.nativeEnum(RoomStatus),
  notes: z.string().optional(),
  isActive: z.boolean(),
});

export const maintenanceBlockSchema = z
  .object({
    roomId: z.string().min(1, "Room is required."),
    startDate: z.coerce.date({ error: "Start date is required." }),
    endDate: z.coerce.date({ error: "End date is required." }),
    reason: z.string().min(5, "Reason must be at least 5 characters."),
  })
  .refine((value) => value.endDate > value.startDate, {
    message: "End date must be after the start date.",
    path: ["endDate"],
  });

export type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;
export type RoomFormValues = z.infer<typeof roomSchema>;
export type MaintenanceBlockFormValues = z.infer<typeof maintenanceBlockSchema>;
