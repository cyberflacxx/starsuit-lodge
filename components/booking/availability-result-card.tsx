import Link from "next/link";
import { AlertTriangle, BedDouble, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AvailabilitySummary } from "@/types";
import { AvailableRoomCard } from "@/components/booking/available-room-card";

type AvailabilityResultCardProps = {
  summary: AvailabilitySummary;
  showContinueButton?: boolean;
};

export function AvailabilityResultCard({
  summary,
  showContinueButton = true,
}: AvailabilityResultCardProps) {
  const bookingDetailsHref =
    summary.branch && summary.roomType
      ? `/booking/details?branchId=${summary.branch.id}&roomTypeId=${summary.roomType.id}&checkInDate=${summary.checkInDate}&checkOutDate=${summary.checkOutDate}&guests=${summary.numberOfGuests}`
      : null;

  return (
    <div
      className={`rounded-[2rem] border px-6 py-8 shadow-[0_18px_45px_rgba(7,26,51,0.08)] sm:px-8 ${
        summary.isFullyBooked
          ? "border-accent/20 bg-accent/8"
          : "border-primary/12 bg-primary/6"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {summary.isFullyBooked ? (
              <AlertTriangle className="h-5 w-5 text-accent" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            )}
            <p
              className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                summary.isFullyBooked ? "text-accent" : "text-primary"
              }`}
            >
              Availability Result
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-semibold">{summary.message}</h2>
          <div className="mt-4 grid gap-2 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>Branch: {summary.branch?.name ?? "Unknown branch"}</p>
            <p>Room Type: {summary.roomType?.name ?? "Any Room Type"}</p>
            <p>Nights: {summary.nights}</p>
            <p>Guests: {summary.numberOfGuests}</p>
            <p>Available rooms: {summary.availableCount}</p>
            <p>
              Estimated total from:{" "}
              {summary.estimatedTotalFrom !== null
                ? `$${summary.estimatedTotalFrom.toFixed(2)}`
                : "N/A"}
            </p>
          </div>
        </div>

        {showContinueButton && !summary.isFullyBooked && bookingDetailsHref ? (
          <Button asChild size="lg">
            <Link href={bookingDetailsHref}>Continue to Room Selection</Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {summary.availableRooms.length ? (
          summary.availableRooms.map((room) => (
            <AvailableRoomCard
              key={room.id}
              room={room}
              continueHref={`/booking/details?branchId=${room.branchId}&roomTypeId=${room.roomTypeId}&roomId=${room.id}&checkInDate=${summary.checkInDate}&checkOutDate=${summary.checkOutDate}&guests=${summary.numberOfGuests}`}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-border bg-white px-5 py-6 md:col-span-2">
            <div className="flex items-center gap-3">
              <BedDouble className="h-5 w-5 text-accent" />
              <p className="text-lg font-semibold">Select another branch, room type, or date range.</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              No rooms are available for your selected dates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
