import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Star, MapPin, Clock, Phone } from "lucide-react";
import { BranchCard } from "@/components/public/branch-card";
import { CtaBand } from "@/components/public/cta-band";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { HomeHero } from "@/components/public/home-hero";
import { RoomTypeCard } from "@/components/public/room-type-card";
import { SectionHeading } from "@/components/public/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import {
  getActiveBranches,
  getActiveRoomTypes,
  getContentBlock,
  getFeaturedGalleryImages,
  getPublicServices,
} from "@/lib/public-data";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Starsuit Lodges | Comfortable Lodge Stays in Mutare & Chipinge",
  description:
    "Book your stay at Starsuit Lodges - premium lodge accommodation in Mutare and Chipinge, Zimbabwe. Online booking, secure parking, and warm hospitality.",
};

const stats = [
  { value: "2", label: "Branch Locations" },
  { value: "3", label: "Room Categories" },
  { value: "24/7", label: "Guest Support" },
  { value: "100%", label: "Secure Booking" },
];

const testimonials = [
  {
    name: "Tinashe M.",
    location: "Harare",
    rating: 5,
    text: "The Mutare branch exceeded all expectations. Clean rooms, friendly staff, and the booking process was incredibly smooth. Will definitely return.",
  },
  {
    name: "Grace N.",
    location: "Bulawayo",
    rating: 5,
    text: "Chipinge Lodge was the perfect base for our family trip. Quiet, comfortable, and the security parking gave us real peace of mind.",
  },
  {
    name: "David K.",
    location: "Gweru",
    rating: 5,
    text: "Booked online from my phone without any hassle. The room was exactly as shown. Professional hospitality at a great price point.",
  },
];

export default async function HomePage() {
  const [branches, roomTypes, services, featuredImages, heroBlock, servicesBlock] =
    await Promise.all([
      getActiveBranches(),
      getActiveRoomTypes(),
      getPublicServices(),
      getFeaturedGalleryImages(),
      getContentBlock("home-hero"),
      getContentBlock("home-services"),
    ]);

  const topServices = services.slice(0, 6);

  return (
    <>
      <HomeHero content={heroBlock} />

      {/* Stats strip */}
      <section className="bg-primary py-10">
        <div className="shell">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <p className="font-display text-4xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="section-gap bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Our Branches"
            title="Two premium lodges across Zimbabwe's eastern highlands."
            description="Whether you're heading to Mutare for business or exploring Chipinge's scenic surroundings, Starsuit Lodges offers consistent quality, comfort, and convenience at both locations."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {branches.length ? (
              branches.map((branch) => <BranchCard key={branch.id} branch={branch} />)
            ) : (
              <div className="surface-card px-6 py-8 text-center lg:col-span-2">
                <p className="text-lg font-semibold">Branch information coming soon.</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  We&apos;re finalising our branch details. Check back shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="section-gap bg-muted">
        <div className="shell">
          <SectionHeading
            eyebrow="Accommodation"
            title="Rooms designed for rest, business, and everything in between."
            description="Choose from Standard, Deluxe, or Executive rooms - each offering a distinct level of comfort and amenity to match your travel purpose and budget."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roomTypes.length ? (
              roomTypes.map((roomType) => (
                <RoomTypeCard key={roomType.id} roomType={roomType} />
              ))
            ) : (
              <div className="surface-card px-6 py-8 text-center md:col-span-2 xl:col-span-3">
                <p className="text-lg font-semibold">Room details coming soon.</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  Room information is being finalised.
                </p>
              </div>
            )}
          </div>
          <div className="mt-10 flex items-center gap-4">
            <Button asChild>
              <Link href="/rooms">View All Rooms</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/booking">Check Availability</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why choose Starsuit */}
      <section className="section-gap bg-white">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Why Starsuit Lodges"
                title="A hospitality experience built around your peace of mind."
                description="From the moment you book to the moment you check out, every touchpoint is designed to remove uncertainty and deliver genuine comfort."
              />
              <ul className="mt-8 space-y-4">
                {[
                  "Instant online booking - no phone calls or waiting",
                  "Secure, guarded parking at both branches",
                  "Flexible room categories for every budget",
                  "Airport and station pickup support available",
                  "Responsive guest support before and during your stay",
                  "Clear cancellation and refund policies",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base leading-7">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80"
                  alt="Starsuit Lodges lobby"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative mt-8 h-64 overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"
                  alt="Comfortable room interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-64 overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80"
                  alt="Pool and outdoor area"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative -mt-8 h-64 overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
                  alt="Dining and restaurant area"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-gap bg-muted">
        <div className="shell">
          <SectionHeading
            eyebrow="Guest Services"
            title={
              servicesBlock?.title ??
              "Everything you need for a seamless, worry-free stay."
            }
            description={
              servicesBlock?.body ??
              "Starsuit Lodges goes beyond a comfortable bed - our services are designed to support you from arrival to departure at both Mutare and Chipinge branches."
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {topServices.length ? (
              topServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <div className="surface-card px-6 py-8 text-center md:col-span-2 xl:col-span-3">
                <p className="text-lg font-semibold">Service details coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Guest Reviews"
            title="What guests say about Starsuit Lodges."
            description="Real feedback from travellers who've stayed with us across Mutare and Chipinge."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="surface-card px-6 py-7 sm:px-7">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section-gap bg-muted">
        <div className="shell">
          <SectionHeading
            eyebrow="Photo Gallery"
            title="See the spaces that await you at Starsuit Lodges."
            description="Browse rooms, common areas, and branch exteriors before you arrive - so you can choose with confidence."
          />
          <div className="mt-10">
            <GalleryGrid images={featuredImages} limit={6} />
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="bg-white py-12">
        <div className="shell">
          <div className="grid gap-6 rounded-4xl border border-border bg-muted px-6 py-8 sm:grid-cols-3 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em]">Call Us</p>
                <p className="mt-1 text-lg font-semibold">+263 78 806 4458</p>
                <p className="text-sm text-muted-foreground">Mon – Sun, 6am – 10pm</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em]">Find Us</p>
                <p className="mt-1 text-base font-semibold">Mutare & Chipinge</p>
                <Link href="/branches" className="text-sm text-accent hover:underline">
                  Get directions →
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em]">Check-in</p>
                <p className="mt-1 text-base font-semibold">From 2:00 PM</p>
                <p className="text-sm text-muted-foreground">Check-out by 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to book your stay at Starsuit Lodges?"
        description="Choose your branch, pick your dates, and secure your room in minutes - no phone call needed. Both Mutare and Chipinge are waiting for you."
        buttonLabel="Book a Room Now"
        buttonHref="/booking"
      />
    </>
  );
}
