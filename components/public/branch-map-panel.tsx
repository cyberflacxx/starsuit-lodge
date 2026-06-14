"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Map, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

type BranchMapPanelProps = {
  branchName: string;
  city: string;
  mapUrl: string;
};

export function BranchMapPanel({ branchName, city, mapUrl }: BranchMapPanelProps) {
  const [showRoute, setShowRoute] = useState(false);
  const destination = useMemo(
    () => `${branchName}, ${city}, Zimbabwe`,
    [branchName, city],
  );
  const encodedDestination = encodeURIComponent(destination);
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodedDestination}&output=embed`;
  const routeEmbedSrc = `https://www.google.com/maps?output=embed&f=d&source=s_d&saddr=Current+Location&daddr=${encodedDestination}`;
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[1.8rem] border border-border bg-white shadow-[0_18px_45px_rgba(7,26,51,0.08)]">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Location Map
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              View {branchName} on Google Maps.
            </p>
          </div>
          <Map className="h-5 w-5 text-primary" />
        </div>
        <iframe
          title={`${branchName} map`}
          src={mapEmbedSrc}
          className="h-[320px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={() => setShowRoute((value) => !value)}>
          <Route className="mr-2 h-4 w-4" />
          {showRoute ? "Hide Route" : "Show Route"}
        </Button>
        <Button asChild variant="outline">
          <Link href={mapUrl || routeUrl} target="_blank" rel="noreferrer">
            Open in Google Maps
          </Link>
        </Button>
      </div>

      {showRoute ? (
        <div className="overflow-hidden rounded-[1.8rem] border border-border bg-white shadow-[0_18px_45px_rgba(7,26,51,0.08)]">
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Route Directions
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Google Maps will calculate directions to {branchName} from your current location.
            </p>
          </div>
          <iframe
            title={`${branchName} route directions`}
            src={routeEmbedSrc}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}
    </div>
  );
}
