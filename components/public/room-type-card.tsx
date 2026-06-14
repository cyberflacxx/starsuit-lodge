import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users } from "lucide-react";
import type { PublicRoomType } from "@/lib/public-data";
import { Button } from "@/components/ui/button";
import { roomTypePlaceholderImages } from "@/lib/media-placeholders";

type RoomTypeCardProps = {
  roomType: PublicRoomType;
};

export function RoomTypeCard({ roomType }: RoomTypeCardProps) {
  const imageSrc = roomTypePlaceholderImages[roomType.slug] ?? "/images/stock/standard-room.jpg";

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <div className="relative h-52">
        <Image
          src={imageSrc}
          alt={`${roomType.name} interior preview`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,51,0.02),rgba(7,26,51,0.42))]" />
        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm">
          <BedDouble className="h-5 w-5" />
        </div>
      </div>
      <div className="flex h-full flex-col px-6 py-7 sm:px-7">
        <h3 className="text-2xl font-semibold">{roomType.name}</h3>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          From ${roomType.basePrice} per night
        </p>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{roomType.description}</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
          <Users className="h-4 w-4" />
          Capacity {roomType.capacity}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Bed type: {roomType.bedType}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {roomType.amenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground/82"
            >
              {amenity}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild>
            <Link href={`/booking?roomType=${roomType.slug}`}>Book This Room</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
