import { z } from "zod";

const reportPresetSchema = z.enum([
  "TODAY",
  "THIS_WEEK",
  "THIS_MONTH",
  "LAST_30_DAYS",
  "THIS_YEAR",
  "CUSTOM",
]);

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.");

function optionalTrimmedString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function parseUtcDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const maxRangeDays = 366 * 2;

export const reportFilterSchema = z
  .object({
    branchId: z.preprocess(optionalTrimmedString, z.string().optional()),
    fromDate: z.preprocess(optionalTrimmedString, dateStringSchema.optional()),
    toDate: z.preprocess(optionalTrimmedString, dateStringSchema.optional()),
    preset: reportPresetSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.preset === "CUSTOM") {
      if (!data.fromDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fromDate"],
          message: "From date is required for a custom range.",
        });
      }

      if (!data.toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["toDate"],
          message: "To date is required for a custom range.",
        });
      }
    }

    if (data.fromDate && !data.toDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message: "To date is required when from date is provided.",
      });
    }

    if (data.toDate && !data.fromDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fromDate"],
        message: "From date is required when to date is provided.",
      });
    }

    const fromDate = parseUtcDate(data.fromDate);
    const toDate = parseUtcDate(data.toDate);

    if (data.fromDate && !fromDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fromDate"],
        message: "Enter a valid from date.",
      });
    }

    if (data.toDate && !toDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message: "Enter a valid to date.",
      });
    }

    if (fromDate && toDate) {
      if (toDate < fromDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["toDate"],
          message: "To date must be after or equal to from date.",
        });
      }

      const diffInDays =
        Math.floor((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;

      if (diffInDays > maxRangeDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["toDate"],
          message: "Date range cannot exceed 2 years.",
        });
      }
    }
  });

export type ReportFilterValues = z.infer<typeof reportFilterSchema>;
