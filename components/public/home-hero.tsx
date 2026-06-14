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
    <section className="relative min-h-screen overflow-hidden sm:min-h-[92vh]">
      <Image
        src={pageHeroImages.home}
        alt="Starsuit Lodges - elegant lodge exterior"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(7,26,51,0.72)_0%,rgba(7,26,51,0.55)_50%,rgba(7,26,51,0.82)_100%)]" />

      <div className="relative z-10 shell flex min-h-screen flex-col justify-end pb-10 pt-28 sm:min-h-[92vh] sm:pb-14 sm:pt-[38vh] lg:pb-16 lg:pt-[40vh]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="max-w-3xl text-3xl font-semibold leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {content?.title ?? (
              <>
                Where comfort meets
                <span className="text-white/80"> eastern Zimbabwe.</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
            {content?.body ??
              "Premium lodge accommodation in Mutare and Chipinge - with online booking, secure parking, and genuine Zimbabwean hospitality waiting for you."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
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
          <span className="mt-5 inline-flex items-center rounded-full border border-white/22 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-white/85 sm:mt-6">
            Starsuit Hospitality - Zimbabwe
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="mt-8 grid grid-cols-2 gap-2 sm:mt-12 sm:gap-3 md:grid-cols-4"
        >
          {heroHighlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.07, duration: 0.4 }}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-sm sm:gap-3 sm:px-4 sm:py-3.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white sm:h-9 sm:w-9">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold leading-tight text-white sm:text-sm">{item.label}</p>
                  <p className="truncate text-xs text-white/65">{item.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
