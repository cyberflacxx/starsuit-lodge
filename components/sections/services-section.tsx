"use client";

import { motion } from "framer-motion";
import {
  CarFront,
  ConciergeBell,
  HandHelping,
  LaptopMinimalCheck,
  Map,
  Shield,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";

const serviceIcons = {
  "Comfortable Rooms": ConciergeBell,
  "Secure Parking": Shield,
  "Pickup Support": CarFront,
  "Online Booking": LaptopMinimalCheck,
  "Guest Assistance": HandHelping,
  "Branch Choice": Map,
} as const;

export function ServicesSection() {
  return (
    <section className="section-gap bg-white">
      <div className="shell">
        <div className="max-w-3xl">
          <span className="eyebrow">Services</span>
          <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
            Essential guest services presented with a hospitality-first tone.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
            The public site now introduces the service promise that future booking,
            management, and payment modules will support.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = serviceIcons[service.title];

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="surface-card px-6 py-7 sm:px-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {service.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
