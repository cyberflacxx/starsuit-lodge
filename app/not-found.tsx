import Link from "next/link";
import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] items-center justify-center py-24">
      <div className="surface-card max-w-2xl px-8 py-12 text-center sm:px-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPinned className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Page Not Found
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          This lodge page is not on the map.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
          Return to the homepage and continue exploring Starsuit Lodge Mutare and
          Starsuit Lodge Chipinge.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
