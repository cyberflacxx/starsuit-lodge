"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BedDouble } from "lucide-react";
import { ROOM_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function RoomPreview() {
  return (
    <section className="section-gap bg-muted">
      <div className="shell">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Rooms</span>
            <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
              Core room categories prepared for future availability logic.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            The booking engine is not active yet, but the public-facing room
            presentation is ready for the next module.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ROOM_TYPES.map((room, index) => (
            <motion.article
              key={room.slug}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="surface-card px-6 py-7 sm:px-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BedDouble className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{room.name}</h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {room.description}
              </p>
              <p className="mt-6 text-lg font-semibold text-accent">{room.priceLabel}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-start">
          <Button asChild>
            <Link href="/rooms">View Rooms</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
