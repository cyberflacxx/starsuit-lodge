import { z } from "zod";

function optionalTrimmedString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export const mockPaymentConfirmationSchema = z.object({
  bookingReference: z
    .string()
    .trim()
    .min(1, "Booking reference is required.")
    .refine((value) => value.startsWith("STL-"), {
      message: "Booking reference must start with STL-.",
    }),
  paymentId: z.string().trim().min(1, "Payment id is required."),
  payerPhone: z.preprocess(
    optionalTrimmedString,
    z.string().min(7, "Payer phone number must be at least 7 characters.").optional(),
  ),
  confirmationNote: z.preprocess(
    optionalTrimmedString,
    z.string().max(300, "Confirmation note must not exceed 300 characters.").optional(),
  ),
});

export type MockPaymentConfirmationValues = z.infer<typeof mockPaymentConfirmationSchema>;
