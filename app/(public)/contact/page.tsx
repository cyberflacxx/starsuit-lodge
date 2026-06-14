import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowUpRight } from "lucide-react";
import { ContactCard } from "@/components/public/contact-card";
import { CtaBand } from "@/components/public/cta-band";
import { PageHero } from "@/components/public/page-hero";
import { Button } from "@/components/ui/button";
import { getActiveBranches, getContentBlock } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Contact Starsuit Lodges | Reach Us in Mutare or Chipinge",
  description:
    "Get in touch with Starsuit Lodges. Find contact details for our Mutare and Chipinge branches, or send us an enquiry online. We respond within a few hours.",
};

const quickContacts = [
  {
    icon: Phone,
    title: "Call or WhatsApp",
    value: "+263 78 806 4458",
    sub: "Monday – Sunday, 6:00 AM – 10:00 PM",
    href: "tel:+263788064458",
    actionLabel: "Call now",
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "bookings@starsuitlodges.com",
    sub: "We reply within a few hours during business hours",
    href: "mailto:bookings@starsuitlodges.com",
    actionLabel: "Send email",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Chat with us directly",
    sub: "Quick questions answered fast on WhatsApp",
    href: "https://wa.me/263788064458",
    actionLabel: "Open WhatsApp",
  },
  {
    icon: Clock,
    title: "Office Hours",
    value: "6:00 AM – 10:00 PM",
    sub: "Every day including public holidays",
    href: null,
    actionLabel: null,
  },
];

const faqs = [
  {
    q: "Can I book by phone instead of online?",
    a: "Yes - call us on +263 78 806 4458 and our team will take your booking details and confirm availability for your preferred dates.",
  },
  {
    q: "How do I cancel or change my booking?",
    a: "Contact us at least 24 hours before your check-in date by phone or email and we will assist with changes or cancellations at no charge.",
  },
  {
    q: "Do you offer airport or bus station pickup?",
    a: "Yes, pickup support is available on request. Let us know your arrival details when you book and we will arrange transport from Mutare or Chipinge stations.",
  },
  {
    q: "Are early check-ins or late check-outs possible?",
    a: "Early check-in from 12:00 PM and late check-out until 12:00 PM can be arranged, subject to availability. Contact us in advance to confirm.",
  },
  {
    q: "Do you accept group or corporate bookings?",
    a: "Absolutely. We accommodate tour groups, corporate teams, and events. Email us with your group size and dates for a tailored quote.",
  },
];

export default async function ContactPage() {
  const [branches, contactBlock] = await Promise.all([
    getActiveBranches(),
    getContentBlock("contact-display"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={contactBlock?.title ?? "We are ready to help - before and during your stay."}
        description={
          contactBlock?.body ??
          "Reach out by phone, WhatsApp, or email. Our team at both Mutare and Chipinge branches responds quickly and can help with bookings, directions, and anything in between."
        }
        actions={[
          { label: "Book a Room", href: "/booking" },
          { label: "Explore Branches", href: "/branches", variant: "outline" },
        ]}
        imageKey="contact"
      />

      {/* Quick contact grid */}
      <section className="section-gap bg-white">
        <div className="shell">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickContacts.map(({ icon: Icon, title, value, sub, href, actionLabel }) => (
              <div key={title} className="surface-card px-5 py-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {title}
                </p>
                <p className="mt-1 text-base font-semibold leading-tight">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-5">{sub}</p>
                {href && actionLabel && (
                  <a
                    href={href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {actionLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branch contacts + enquiry form */}
      <section className="section-gap bg-muted">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <h2 className="text-3xl font-semibold">Branch contacts</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Reach the specific branch you plan to stay at for the most relevant assistance.
            </p>
            <div className="mt-8 grid gap-5">
              {branches.length ? (
                branches.map((branch) => <ContactCard key={branch.id} branch={branch} />)
              ) : (
                <div className="surface-card px-6 py-8 text-center">
                  <p className="text-base text-muted-foreground">Branch contact details coming soon.</p>
                </div>
              )}
            </div>

            {/* Map placeholder */}
            <div className="mt-6 overflow-hidden rounded-3xl">
              <div className="relative flex h-48 items-center justify-center bg-muted border border-border rounded-3xl">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-primary/40" />
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Serving Mutare & Chipinge, Zimbabwe
                  </p>
                  <p className="text-xs text-muted-foreground">Eastern Highlands Region</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="surface-card bg-white px-6 py-8 sm:px-8">
            <span className="eyebrow">Send an Enquiry</span>
            <h2 className="mt-4 text-3xl font-semibold">How can we help?</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Fill in the form and a member of our team will get back to you within a few hours.
            </p>
            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="mb-2 block text-sm font-semibold">
                    First name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    autoComplete="given-name"
                    className="h-12 w-full rounded-2xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Tinashe"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="mb-2 block text-sm font-semibold">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    autoComplete="family-name"
                    className="h-12 w-full rounded-2xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Moyo"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="h-12 w-full rounded-2xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                  Phone / WhatsApp
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  className="h-12 w-full rounded-2xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="+263 77 000 0000"
                />
              </div>
              <div>
                <label htmlFor="branch" className="mb-2 block text-sm font-semibold">
                  Branch of interest
                </label>
                <select
                  id="branch"
                  className="h-12 w-full rounded-2xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
                >
                  <option value="">Select a branch</option>
                  <option value="mutare">Starsuit Lodge Mutare</option>
                  <option value="chipinge">Starsuit Lodge Chipinge</option>
                  <option value="both">Both / Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-2xl border border-border bg-muted px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  placeholder="Tell us what you need - dates, room type, group size, special requests…"
                />
              </div>
              <Button type="button" size="lg" className="w-full">
                Send Enquiry
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Or call us directly:{" "}
                <a href="tel:+263788064458" className="font-semibold text-primary hover:text-accent">
                  +263 78 806 4458
                </a>
              </p>
            </form>
            <p className="mt-5 text-sm text-muted-foreground">
              Prefer to book directly?{" "}
              <Link href="/booking" className="font-semibold text-primary hover:text-accent">
                Reserve a room online →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-gap bg-white">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="eyebrow">FAQs</span>
              <h2 className="mt-4 text-4xl font-semibold">Common questions</h2>
              <p className="mt-4 text-base text-muted-foreground">
                Quick answers to things guests ask us most often.
              </p>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="rounded-3xl border border-border bg-muted px-6 py-5">
                  <p className="font-semibold">{q}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Skip the Wait"
        title="Ready to book? Our online system is faster than a phone call."
        description="Browse availability, choose your room, and confirm your stay in under two minutes - at any time of day."
        buttonLabel="Book Online Now"
        buttonHref="/booking"
      />
    </>
  );
}
