const cardOrder = [
  { key: "totalBookings", label: "Total Bookings" },
  { key: "pendingBookings", label: "Pending Bookings" },
  { key: "confirmedBookings", label: "Confirmed Bookings" },
  { key: "pendingPayments", label: "Pending Payments" },
  { key: "todaysArrivals", label: "Today's Arrivals" },
  { key: "todaysCheckouts", label: "Today's Checkouts" },
] as const;

type BookingStats = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  checkedInBookings: number;
  pendingPayments: number;
  paidPayments: number;
  todaysArrivals: number;
  todaysCheckouts: number;
};

export function BookingStatsCards({ stats }: { stats: BookingStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cardOrder.map((card) => (
        <div
          key={card.key}
          className="surface-card rounded-[1.8rem] px-6 py-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {card.label}
          </p>
          <p className="mt-4 text-4xl font-semibold text-foreground">
            {stats[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
