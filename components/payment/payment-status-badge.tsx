import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types";

const statusMap: Record<
  PaymentStatus,
  {
    label: string;
    className: string;
  }
> = {
  UNPAID: {
    label: "Unpaid",
    className: "border-accent/20 bg-accent/8 text-accent",
  },
  PENDING: {
    label: "Pending",
    className: "border-primary/20 bg-primary/8 text-primary",
  },
  PAID: {
    label: "Paid",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  FAILED: {
    label: "Failed",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  REFUNDED: {
    label: "Refunded",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusMap[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
