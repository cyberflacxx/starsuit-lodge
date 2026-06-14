import Link from "next/link";
import { Button } from "@/components/ui/button";

type CtaBandProps = {
  eyebrow?: string;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export function CtaBand({
  eyebrow = "Reserve Ahead",
  title,
  description,
  buttonLabel = "Book Now",
  buttonHref = "/booking",
}: CtaBandProps) {
  return (
    <section className="section-gap">
      <div className="shell">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#072b66_0%,#0b3d91_50%,#d72638_160%)] px-6 py-10 text-white shadow-[0_24px_70px_rgba(7,26,51,0.18)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              {eyebrow}
            </span>
            <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">{title}</h2>
            <p className="mt-4 text-base leading-8 text-white/82 sm:text-lg">
              {description}
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <Button asChild size="lg" variant="secondary">
              <Link href={buttonHref}>{buttonLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
