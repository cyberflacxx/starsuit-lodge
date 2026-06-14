"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Headset, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroStats = [
  {
    icon: MapPin,
    label: "2 Branches",
  },
  {
    icon: Sparkles,
    label: "Online Booking",
  },
  {
    icon: Headset,
    label: "Guest Support",
  },
  {
    icon: ShieldCheck,
    label: "Secure Reservations",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(215,38,56,0.14),transparent_24%),linear-gradient(135deg,#f5f8ff_0%,#ffffff_48%,#e9f0ff_100%)]">
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(11,61,145,0.08),transparent)]" />
      <div className="shell section-gap relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <span className="eyebrow">Starsuit Hospitality</span>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
            Stay Comfortably at Starsuit Lodges
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Modern lodge accommodation in Mutare and Chipinge with easy online
            booking and secure reservation support.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/booking">Book a Room</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/branches">Explore Branches</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          className="surface-card relative overflow-hidden px-6 py-8 sm:px-8 lg:px-10"
        >
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(11,61,145,0.06),transparent_55%,rgba(215,38,56,0.08))]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Guest Preview
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Your future stay starts with a stronger foundation.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              This first module prepares the public experience, responsive layout,
              and booking-ready structure for the platform.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + index * 0.08, duration: 0.45 }}
                    className="rounded-3xl border border-border bg-white/92 p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-lg font-semibold">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
