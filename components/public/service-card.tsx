import {
  CarFront,
  ConciergeBell,
  HandHelping,
  LaptopMinimalCheck,
  Map,
  Shield,
} from "lucide-react";
import type { PublicService } from "@/lib/public-data";

const serviceIcons = {
  "Comfortable Rooms": ConciergeBell,
  "Secure Parking": Shield,
  "Pickup Support": CarFront,
  "Online Booking": LaptopMinimalCheck,
  "Guest Assistance": HandHelping,
  "Branch Choice": Map,
} as const;

type ServiceCardProps = {
  service: PublicService;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon =
    serviceIcons[service.title as keyof typeof serviceIcons] ?? ConciergeBell;

  return (
    <article className="surface-card px-6 py-7 sm:px-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold">{service.title}</h3>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {service.description}
      </p>
    </article>
  );
}
