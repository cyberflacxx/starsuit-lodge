import { PaymentStatusBadge as PublicPaymentStatusBadge } from "@/components/payment/payment-status-badge";
import type { PaymentStatus } from "@/types";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <PublicPaymentStatusBadge status={status} />;
}
