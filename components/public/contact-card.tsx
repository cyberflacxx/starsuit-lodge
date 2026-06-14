import Link from "next/link";
import { Mail, MapPinned, MessageCircleMore, Phone } from "lucide-react";
import type { PublicBranch } from "@/lib/public-data";
import { Button } from "@/components/ui/button";

type ContactCardProps = {
  branch: PublicBranch;
};

function toWhatsAppLink(phone: string) {
  const sanitized = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${sanitized}`;
}

export function ContactCard({ branch }: ContactCardProps) {
  return (
    <article className="surface-card px-6 py-7 sm:px-7">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
        {branch.city}
      </p>
      <h3 className="mt-4 text-2xl font-semibold">{branch.name}</h3>
      <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
        <p className="flex items-start gap-3">
          <MapPinned className="mt-1 h-4 w-4 shrink-0 text-primary" />
          <span>{branch.address}</span>
        </p>
        <p className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-primary" />
          <span>{branch.phone}</span>
        </p>
        <p className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-primary" />
          <span>{branch.email}</span>
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button asChild variant="outline">
          <Link href={toWhatsAppLink(branch.phone)} target="_blank" rel="noreferrer">
            <MessageCircleMore className="mr-2 h-4 w-4" />
            WhatsApp
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={
              branch.mapUrl ||
              `https://www.google.com/maps/search/starsuit+lodge+${branch.city.toLowerCase()}+zimbabwe`
            }
            target="_blank"
            rel="noreferrer"
          >
            View on Google Maps
          </Link>
        </Button>
      </div>
    </article>
  );
}
