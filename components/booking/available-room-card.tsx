import Link from "next/link";
import type { AvailabilityRoom } from "@/types";
import { Button } from "@/components/ui/button";

type AvailableRoomCardProps = {
  room: AvailabilityRoom;
  continueHref?: string;
};

export function AvailableRoomCard({ room, continueHref }: AvailableRoomCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-white px-5 py-5 shadow-[0_12px_35px_rgba(7,26,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {room.branchName}
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{room.roomNumber}</h3>
        </div>
        <span className="rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {room.status}
        </span>
      </div>
      <div className="mt-5 space-y-2 text-sm leading-7 text-muted-foreground sm:text-base">
        <p>Room type: {room.roomTypeName}</p>
        <p>Capacity: {room.capacity} guests</p>
        <p>Price per night: ${room.pricePerNight.toFixed(2)}</p>
        <p>Estimated total: ${room.estimatedTotal.toFixed(2)}</p>
      </div>
      {continueHref ? (
        <div className="mt-5">
          <Button asChild className="w-full">
            <Link href={continueHref}>Continue with this room</Link>
          </Button>
        </div>
      ) : null}
    </article>
  );
}
