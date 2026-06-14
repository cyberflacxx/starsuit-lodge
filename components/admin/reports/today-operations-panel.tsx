import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import { PaymentStatusBadge } from "@/components/admin/bookings/payment-status-badge";
import { ReportEmptyState } from "@/components/admin/reports/report-empty-state";
import { formatDateTime } from "@/lib/formatters";

type OperationRow = {
  bookingReference: string;
  guestName: string;
  phone: string;
  branch: string;
  room: string;
  expectedArrivalTime: Date;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED" | "NO_SHOW";
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
};

type TodayOperationsPanelProps = {
  operations: {
    arrivals: OperationRow[];
    checkouts: OperationRow[];
    pendingPayments: OperationRow[];
    currentlyCheckedIn: OperationRow[];
  };
};

function OperationsList({
  title,
  rows,
}: {
  title: string;
  rows: OperationRow[];
}) {
  if (!rows.length) {
    return (
      <div className="rounded-[1.6rem] border border-border bg-white px-5 py-5">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-3 text-sm text-muted-foreground">No records for this section today.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.6rem] border border-border bg-white px-5 py-5">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <div className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={`${title}-${row.bookingReference}`} className="rounded-3xl bg-muted px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{row.bookingReference}</span>
              <BookingStatusBadge status={row.status} />
              <PaymentStatusBadge status={row.paymentStatus} />
            </div>
            <p className="mt-3 text-sm text-foreground">
              {row.guestName} | {row.phone}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {row.branch} | Room {row.room}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Expected arrival: {formatDateTime(row.expectedArrivalTime)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TodayOperationsPanel({ operations }: TodayOperationsPanelProps) {
  const totalRows =
    operations.arrivals.length +
    operations.checkouts.length +
    operations.pendingPayments.length +
    operations.currentlyCheckedIn.length;

  if (!totalRows) {
    return (
      <ReportEmptyState
        title="No booking data is available for this period."
        description="Today's operations will appear here when active bookings, arrivals, or checkouts exist."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <OperationsList title="Today's Arrivals" rows={operations.arrivals} />
      <OperationsList title="Today's Checkouts" rows={operations.checkouts} />
      <OperationsList title="Pending Payments" rows={operations.pendingPayments} />
      <OperationsList title="Currently Checked In" rows={operations.currentlyCheckedIn} />
    </div>
  );
}
