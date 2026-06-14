import { CalendarDays, Hotel, MoonStar, Receipt, UserRound, Users } from "lucide-react";
import { PaymentStatusBadge } from "@/components/payment/payment-status-badge";
import type { BookingSummary } from "@/types";

type BookingSummaryCardProps = {
  summary: BookingSummary;
  title?: string;
  className?: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function BookingSummaryCard({
  summary,
  title = "Booking Summary",
  className,
}: BookingSummaryCardProps) {
  return (
    <aside
      className={`rounded-[2rem] border border-primary/12 bg-white px-5 py-6 shadow-[0_18px_45px_rgba(7,26,51,0.08)] ${className ?? ""}`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {title}
      </p>

      <div className="mt-5 space-y-4 text-sm text-muted-foreground sm:text-base">
        {summary.bookingReference ? (
          <div className="flex items-start gap-3">
            <Receipt className="mt-1 h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Reference</p>
              <p>{summary.bookingReference}</p>
            </div>
          </div>
        ) : null}

        {summary.guestName ? (
          <div className="flex items-start gap-3">
            <UserRound className="mt-1 h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Guest</p>
              <p>{summary.guestName}</p>
            </div>
          </div>
        ) : null}

        <div className="flex items-start gap-3">
          <Hotel className="mt-1 h-4 w-4 text-primary" />
          <div>
            <p className="font-semibold text-foreground">{summary.branchName}</p>
            <p>
              {summary.roomTypeName} | Room {summary.roomNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-4 w-4 text-primary" />
          <div>
            <p>
              {formatDateLabel(summary.checkInDate)} to {formatDateLabel(summary.checkOutDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MoonStar className="mt-1 h-4 w-4 text-primary" />
          <div>
            <p>
              {summary.nights} night{summary.nights === 1 ? "" : "s"}
            </p>
            <p>{formatCurrency(summary.pricePerNight)} per night</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="mt-1 h-4 w-4 text-primary" />
          <div>
            <p>
              {summary.numberOfGuests} guest{summary.numberOfGuests === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {summary.paymentStatus ? (
          <div className="flex items-start gap-3">
            <Receipt className="mt-1 h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Payment status</p>
              <div className="mt-2">
                <PaymentStatusBadge status={summary.paymentStatus} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 rounded-[1.4rem] bg-muted px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-foreground">Total amount</span>
          <span className="text-xl font-semibold text-primary">
            {formatCurrency(summary.totalAmount)}
          </span>
        </div>
      </div>
    </aside>
  );
}
