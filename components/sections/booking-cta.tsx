import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BookingCta() {
  return (
    <section className="section-gap bg-[linear-gradient(135deg,#072b66_0%,#0b3d91_50%,#d72638_160%)] text-white">
      <div className="shell">
        <div className="rounded-[2rem] border border-white/14 bg-white/8 px-6 py-10 backdrop-blur sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/78">
              Reserve Ahead
            </span>
            <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
              Encourage guests to secure their room before arrival.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              The booking experience is not active yet, but the pathway is ready for
              future room selection, availability checks, and mock payment flow.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Go to Booking</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
