"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, CarFront, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHeroImages } from "@/lib/media-placeholders";

const heroHighlights = [
  { icon: Building2, label: "2 Branches", sub: "Mutare & Chipinge" },
  { icon: Sparkles, label: "Online Booking", sub: "Book in minutes" },
  { icon: ShieldCheck, label: "Secure Parking", sub: "At both locations" },
  { icon: CarFront, label: "Pickup Support", sub: "On request" },
];

type HomeHeroProps = {
  content?: {
    title: string;
    body: string;
  } | null;
};

export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src={pageHeroImages.home}
        alt="Starsuit Lodges - elegant lodge exterior"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Dark overlay - stronger at the bottom for text legibility */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(7,26,51,0.72)_0%,rgba(7,26,51,0.55)_50%,rgba(7,26,51,0.78)_100%)]" />

      {/* Content - pinned to bottom half of hero, clear of navbar */}
      <div className="relative z-10 shell flex min-h-[92vh] flex-col justify-end pb-16 pt-[40vh]">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {content?.title ?? (
              <>
                Where comfort meets
                <span className="text-white/80"> eastern Zimbabwe.</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            {content?.body ??
              "Premium lodge accommodation in Mutare and Chipinge - with online booking, secure parking, and genuine Zimbabwean hospitality waiting for you."}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/booking" className="gap-2">
                Book a Room
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border-white/30 bg-white/12 text-white hover:bg-white/22 hover:text-white"
              variant="outline"
            >
              <Link href="/branches">Explore Branches</Link>
            </Button>
          </div>
          <span className="mt-6 inline-flex items-center rounded-full border border-white/22 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-white/85">
            Starsuit Hospitality - Zimbabwe
          </span>
        </motion.div>

        {/* Feature highlight pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {heroHighlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.07, duration: 0.4 }}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight text-white">{item.label}</p>
                  <p className="text-xs text-white/65">{item.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
