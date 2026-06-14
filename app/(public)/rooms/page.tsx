import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble, Users, Wifi, Wind, Tv, Coffee, Bath, CheckCircle2, ArrowRight
} from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { PageHero } from "@/components/public/page-hero";
import { RoomTypeCard } from "@/components/public/room-type-card";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import { getActiveRoomTypes } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Rooms & Rates | Starsuit Lodges Mutare & Chipinge",
  description:
    "Browse Standard, Deluxe, and Executive rooms at Starsuit Lodges. Compare rates, amenities, and capacity before booking your stay in Mutare or Chipinge.",
};

const allRoomAmenities = [
  { icon: Wifi, label: "Free Wi-Fi in all rooms" },
  { icon: Wind, label: "Air conditioning" },
  { icon: Tv, label: "Flat-screen TV" },
  { icon: Coffee, label: "Tea & coffee station" },
  { icon: Bath, label: "En-suite bathroom" },
  { icon: BedDouble, label: "Premium linen & bedding" },
];

const roomComparison = [
  {
    feature: "Room size",
    standard: "~18 m²",
    deluxe: "~26 m²",
    executive: "~36 m²",
  },
  {
    feature: "Bed type",
    standard: "Double / Twin",
    deluxe: "Queen",
    executive: "King",
  },
  {
    feature: "Guests",
    standard: "1–2",
    deluxe: "1–2",
    executive: "1–3",
  },
  {
    feature: "Work desk",
    standard: "Basic",
    deluxe: "Yes",
    executive: "Yes, premium",
  },
  {
    feature: "Lounge seating",
    standard: "No",
    deluxe: "Armchair",
    executive: "Full seating area",
  },
  {
    feature: "Mini-bar",
    standard: "No",
    deluxe: "Yes",
    executive: "Yes",
  },
  {
    feature: "City/garden view",
    standard: "Standard view",
    deluxe: "Garden view",
    executive: "Premium view",
  },
  {
    feature: "Toiletries",
    standard: "Essential",
    deluxe: "Enhanced",
    executive: "Luxury",
  },
];

const policies = [
  "Check-in from 2:00 PM - early check-in subject to availability",
  "Check-out by 10:00 AM - late check-out can be arranged in advance",
  "Cancellations accepted up to 24 hours before arrival without charge",
  "All rooms are non-smoking - dedicated outdoor areas are available",
  "Pets are not permitted on lodge premises",
  "Children of all ages welcome - cots available on request",
];

export default async function RoomsPage() {
  const roomTypes = await getActiveRoomTypes();

  return (
    <>
      <PageHero
        eyebrow="Rooms & Rates"
        title="Choose the room that fits your stay - and your budget."
        description="From efficient Standard rooms for solo travellers to spacious Executive suites for those who want a little extra, every Starsuit room is prepared to the same high standard of cleanliness and comfort."
        actions={[
          { label: "Check Availability", href: "/booking" },
          { label: "View Branches", href: "/branches", variant: "outline" },
        ]}
        imageKey="rooms"
      />

      {/* Included in every room */}
      <section className="border-b border-border bg-white py-10">
        <div className="shell">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Included in every room
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {allRoomAmenities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-muted px-4 py-4 text-center">
                <Icon className="h-5 w-5 text-primary" />
                <p className="text-xs font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room type cards */}
      <section className="section-gap bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Room Categories"
            title="Three categories, one Starsuit standard."
            description="All room types are available at both Mutare and Chipinge. Availability at each branch depends on your selected dates."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roomTypes.length ? (
              roomTypes.map((roomType) => (
                <RoomTypeCard key={roomType.id} roomType={roomType} />
              ))
            ) : (
              <div className="surface-card px-6 py-8 text-center md:col-span-2 xl:col-span-3">
                <p className="text-lg font-semibold">Room details are being finalised.</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  Please check back shortly or contact us to enquire.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Room comparison table */}
      <section className="section-gap bg-muted">
        <div className="shell">
          <SectionHeading
            eyebrow="Compare Rooms"
            title="Find your perfect fit at a glance."
            description="Use this table to compare room sizes, features, and inclusions across all three categories."
          />
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-foreground">Standard</th>
                    <th className="px-6 py-4 text-center font-semibold text-primary">Deluxe</th>
                    <th className="px-6 py-4 text-center font-semibold text-accent">Executive</th>
                  </tr>
                </thead>
                <tbody>
                  {roomComparison.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-muted/40"}>
                      <td className="px-6 py-3.5 font-medium text-foreground/80">{row.feature}</td>
                      <td className="px-6 py-3.5 text-center text-muted-foreground">{row.standard}</td>
                      <td className="px-6 py-3.5 text-center text-muted-foreground">{row.deluxe}</td>
                      <td className="px-6 py-3.5 text-center text-muted-foreground">{row.executive}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-border bg-primary/5">
                    <td className="px-6 py-4 font-semibold">Starting price</td>
                    <td className="px-6 py-4 text-center font-semibold text-foreground">$50 / night</td>
                    <td className="px-6 py-4 text-center font-semibold text-primary">$75 / night</td>
                    <td className="px-6 py-4 text-center font-semibold text-accent">$100 / night</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            * Prices are per room per night. Final rates depend on branch, dates, and availability.
          </p>
        </div>
      </section>

      {/* Room imagery */}
      <section className="section-gap bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Room Previews"
            title="See inside before you arrive."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
                label: "Standard Room",
                sub: "Clean, efficient, and perfectly comfortable",
              },
              {
                src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80",
                label: "Deluxe Room",
                sub: "More space, warmer ambience, queen bedding",
              },
              {
                src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80",
                label: "Executive Room",
                sub: "Premium furnishings and a king-size bed",
              },
            ].map(({ src, label, sub }) => (
              <figure key={label} className="overflow-hidden rounded-3xl">
                <div className="relative h-64">
                  <Image
                    src={src}
                    alt={label}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="border border-t-0 border-border rounded-b-3xl px-5 py-4 bg-white">
                  <p className="font-semibold">{label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="section-gap bg-muted">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Booking Policies"
              title="Everything you need to know before you book."
              description="We keep our policies straightforward so there are no surprises when you arrive."
            />
            <ul className="mt-8 space-y-3">
              {policies.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm leading-7">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card px-6 py-7 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Ready to book?</p>
            <h3 className="mt-3 text-2xl font-semibold">Secure your room in minutes.</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Choose your branch, select your dates, and complete the booking entirely online. Your confirmation arrives by email with all the details you need.
            </p>
            <div className="mt-6 space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/booking" className="gap-2">
                  Check Availability
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/contact">Ask a Question</Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Need help choosing? Call us on{" "}
              <a href="tel:+263788064458" className="font-medium text-primary hover:text-accent">
                +263 78 806 4458
              </a>
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Book Direct"
        title="Skip the phone call - book your Starsuit room online now."
        description="Live availability across both branches, instant confirmation, and no hidden fees. The way lodge booking should always have been."
        buttonLabel="Book a Room"
        buttonHref="/booking"
      />
    </>
  );
}
