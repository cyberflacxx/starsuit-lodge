import { StatusBadge } from "@/components/admin/status-badge";
import type { BookingStatus } from "@/types";

const toneMap: Record<BookingStatus, Parameters<typeof StatusBadge>[0]["tone"]> = {
  PENDING: "primary",
  CONFIRMED: "success",
  CHECKED_IN: "available",
  CHECKED_OUT: "muted",
  CANCELLED: "danger",
  NO_SHOW: "blocked",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <StatusBadge label={status.replaceAll("_", " ")} tone={toneMap[status]} />;
}
