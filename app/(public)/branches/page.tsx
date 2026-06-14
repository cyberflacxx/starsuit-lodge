import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight, Wifi, Car, Coffee, ShieldCheck } from "lucide-react";
import { BranchCard } from "@/components/public/branch-card";
import { CtaBand } from "@/components/public/cta-band";
import { PageHero } from "@/components/public/page-hero";
import { Button } from "@/components/ui/button";
import { getActiveBranches } from "@/lib/public-data";
import { branchPlaceholderImages } from "@/lib/media-placeholders";

export const metadata: Metadata = {
  title: "Our Branches | Starsuit Lodge Mutare & Chipinge",
  description:
    "Explore Starsuit Lodge Mutare and Chipinge - two premium lodge destinations in Zimbabwe's eastern highlands with comfortable rooms, secure parking, and easy online booking.",
};

const branchHighlights: Record<string, { tagline: string; features: string[]; nearby: string[] }> = {
  mutare: {
    tagline: "Zimbabwe's gateway to the eastern highlands.",
    features: [
      "Central Mutare location - walking distance to key amenities",
      "Business traveller facilities including reliable Wi-Fi",
      "Secure on-site parking for all guests",
      "Close to Sakubva Market and Mutare CBD",
    ],
    nearby: ["Mutare Museum", "Bvumba Mountains", "Sakubva Market", "Mutare City CBD"],
  },
  chipinge: {
    tagline: "Relaxed stays in Zimbabwe's tea and coffee highlands.",
    features: [
      "Peaceful setting ideal for leisure and nature stays",
      "Garden grounds and outdoor seating areas",
      "Close to Chipinge town centre and local markets",
      "Access to surrounding highlands and scenic routes",
    ],
    nearby: ["Chipinge Town Centre", "Eastern Highlands Tea Estates", "Chirinda Forest", "Zongororo Pass"],
  },
};

const commonAmenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Car, label: "Secure Parking" },
  { icon: Coffee, label: "Breakfast Options" },
  { icon: ShieldCheck, label: "24/7 Security" },
];

export default async function BranchesPage() {
  const branches = await getActiveBranches();

  return (
    <>
      <PageHero
        eyebrow="Our Branches"
        title="Two lodge destinations, one consistent Starsuit standard."
        description="Whether you are heading to Mutare for business or exploring Chipinge's highlands scenery, Starsuit Lodges delivers comfort, security, and genuine hospitality at every stay."
        actions={[
          { label: "Book a Room", href: "/booking" },
          { label: "Contact Us", href: "/contact", variant: "outline" },
        ]}
        imageKey="branches"
      />

      {/* Common amenities strip */}
      <section className="border-b border-border bg-white py-8">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {commonAmenities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <Icon className="h-5 w-5 text-primary" />
                {label}
              </div>
            ))}
            <p className="text-sm text-muted-foreground">- Available at both branches</p>
          </div>
        </div>
      </section>

      {/* Branch cards */}
      <section className="section-gap bg-white">
        <div className="shell grid gap-6 lg:grid-cols-2">
          {branches.length ? (
            branches.map((branch) => <BranchCard key={branch.id} branch={branch} />)
          ) : (
            <div className="surface-card px-6 py-8 text-center lg:col-span-2">
              <p className="text-lg font-semibold">Branch details are being finalised.</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                Please check back shortly or contact us directly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Detailed branch sections */}
      {branches.map((branch, idx) => {
        const highlights = branchHighlights[branch.publicSlug];
        const imageSrc =
          branchPlaceholderImages[branch.publicSlug] ??
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80";
        const isEven = idx % 2 === 0;

        return (
          <section key={branch.id} className={`section-gap ${isEven ? "bg-muted" : "bg-white"}`}>
            <div className="shell">
              <div className={`grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 ${!isEven ? "lg:[&>*:first-child]:order-last" : ""}`}>
                <div className="relative h-96 overflow-hidden rounded-3xl">
                  <Image
                    src={imageSrc}
                    alt={`${branch.name} exterior`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,26,51,0.45))]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                      {branch.city}
                    </p>
                    <p className="mt-1 text-2xl font-semibold">{branch.name}</p>
                  </div>
                </div>

                <div>
                  <span className="eyebrow">{branch.city} Branch</span>
                  <h2 className="mt-4 text-4xl font-semibold">{branch.name}</h2>
                  {highlights && (
                    <p className="mt-2 text-base font-medium text-accent">{highlights.tagline}</p>
                  )}
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{branch.description}</p>

                  {highlights && (
                    <ul className="mt-6 space-y-2">
                      {highlights.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm leading-6">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {highlights && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Nearby
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {highlights.nearby.map((place) => (
                          <span
                            key={place}
                            className="flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium"
                          >
                            <MapPin className="h-3 w-3 text-primary" />
                            {place}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      {branch.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      {branch.email}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {branch.address}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild>
                      <Link href={`/booking?branch=${branch.publicSlug}`}>
                        Book at {branch.city}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/branches/${branch.publicSlug}`}>Full Branch Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <CtaBand
        eyebrow="Make Your Choice"
        title="Pick your branch and lock in your room before you travel."
        description="Branch-specific booking links take you straight to availability for Mutare or Chipinge - no guessing which one you mean."
        buttonLabel="Check Availability"
        buttonHref="/booking"
      />
    </>
  );
}
