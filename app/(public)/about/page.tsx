import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, HeartHandshake, Hotel, Compass, Award, Users, MapPin } from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/public/section-heading";
import { getActiveBranches, getContentBlock } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "About Starsuit Lodges | Our Story, Values & Team",
  description:
    "Learn about Starsuit Lodges - Zimbabwe's premium lodge brand serving Mutare and Chipinge with comfortable accommodation, warm hospitality, and easy online booking.",
};

const values = [
  {
    title: "Genuine Comfort",
    description:
      "Every room is prepared to the same standard - clean, well-furnished, and ready to help you rest properly after a long journey or a full day of work.",
    icon: Hotel,
  },
  {
    title: "Local Knowledge",
    description:
      "Our staff know Mutare and Chipinge inside out. Need a restaurant recommendation, a taxi, or directions? We have you covered before you even ask.",
    icon: Compass,
  },
  {
    title: "Guest Promise",
    description:
      "We hold ourselves to a simple standard: every guest should leave feeling they got more than they paid for. That drives every decision we make.",
    icon: HeartHandshake,
  },
  {
    title: "Consistent Quality",
    description:
      "Whether you stay at our Mutare branch or Chipinge, you will find the same attention to detail, the same cleanliness, and the same warm welcome.",
    icon: Award,
  },
];

const stats = [
  { value: "2", label: "Lodge branches" },
  { value: "3+", label: "Room categories" },
  { value: "100s", label: "Guests hosted" },
  { value: "24/7", label: "Support available" },
];

const teamMembers = [
  {
    name: "Management Team",
    role: "Mutare Branch",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    description: "Leading hospitality operations at our Mutare flagship with a focus on business travellers and long-stay guests.",
  },
  {
    name: "Branch Leadership",
    role: "Chipinge Branch",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    description: "Overseeing the Chipinge experience with deep community roots and a commitment to personal service.",
  },
  {
    name: "Guest Relations",
    role: "Both Branches",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    description: "Dedicated to making every interaction - from booking to checkout - feel easy, warm, and human.",
  },
];

export default async function AboutPage() {
  const [aboutBlock, branches] = await Promise.all([
    getContentBlock("about-company"),
    getActiveBranches(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="About Starsuit Lodges"
        title="Comfortable, dependable hospitality across Zimbabwe's eastern highlands."
        description="We started Starsuit Lodges with one goal: give travellers heading to Mutare and Chipinge a place they genuinely look forward to returning to."
        actions={[
          { label: "Book a Room", href: "/booking" },
          { label: "Explore Branches", href: "/branches", variant: "outline" },
        ]}
        imageKey="about"
      />

      {/* Stats */}
      <section className="bg-primary py-12">
        <div className="shell">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <p className="font-display text-4xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="section-gap bg-white">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Built for travellers who deserve better than average."
              description={
                aboutBlock?.body ??
                "Starsuit Lodges was founded to fill a gap in Zimbabwe's eastern highlands - quality lodge accommodation that felt modern, welcoming, and easy to book without picking up the phone. We opened our Mutare branch first, then expanded to Chipinge after seeing the demand from guests exploring the region."
              }
            />
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              Today, both branches maintain the same standard: well-prepared rooms, attentive staff, secure premises, and genuine care for every guest - whether you are here for a single night or several weeks.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              We are proud to serve business travellers, families, tour groups, and solo adventurers. Every guest matters equally at Starsuit Lodges.
            </p>
          </div>
          <div className="relative">
            <div className="relative h-96 overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80"
                alt="Starsuit Lodges exterior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 h-48 w-48 overflow-hidden rounded-3xl border-4 border-white shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80"
                alt="Lodge lobby"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-gap bg-muted">
        <div className="shell">
          <SectionHeading
            eyebrow="Our Values"
            title="The principles behind every Starsuit stay."
            description="These are not slogans on a wall - they are the commitments our staff live by every single day."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="surface-card px-6 py-7 sm:px-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-gap bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Our People"
            title="The team that makes Starsuit Lodges what it is."
            description="Friendly, knowledgeable, and always ready to help - our staff are the heart of the Starsuit experience."
            align="center"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-border shadow-md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-gap bg-muted">
        <div className="shell">
          <SectionHeading
            eyebrow="Why Choose Starsuit Lodges"
            title="Designed for guests who value certainty before they travel."
            description="Every public page is built to help you compare branches, review room options, and understand exactly what to expect before you arrive."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Two branch locations across Mutare and Chipinge",
              "Standard, Deluxe, and Executive room categories",
              "Secure, guarded parking at every branch",
              "Airport and station pickup support on request",
              "Online booking from any device, 24 hours a day",
              "Clear pricing with no hidden charges",
              "Branch-specific local knowledge and recommendations",
              "Responsive support before, during, and after your stay",
              "Flexible check-in arrangements for early arrivals",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-3xl bg-white px-5 py-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branch coverage */}
      <section className="section-gap bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow="Branch Locations"
            title="Find us across Zimbabwe's eastern region."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {branches.length ? (
              branches.map((branch) => (
                <div key={branch.id} className="surface-card overflow-hidden">
                  <div className="flex items-start gap-4 px-6 py-6 sm:px-7">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{branch.name}</h3>
                      <p className="mt-1 text-sm text-accent font-medium">{branch.city}</p>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{branch.description}</p>
                      <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                        <p>{branch.address}</p>
                        <p>{branch.phone}</p>
                        <p>{branch.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="surface-card px-6 py-8 text-center md:col-span-2">
                <p className="text-base text-muted-foreground">Branch details coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Ready to Stay?"
        title="Choose a branch and reserve your room online in minutes."
        description="No phone calls, no uncertainty. Browse rooms, check availability, and confirm your booking before you travel."
        buttonLabel="Start Booking"
        buttonHref="/booking"
      />
    </>
  );
}
