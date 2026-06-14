"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import { BRANCHES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function BranchPreview() {
  return (
    <section className="section-gap bg-white">
      <div className="shell">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Branch Preview</span>
            <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
              Designed for stays in Mutare and Chipinge.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            Each branch is positioned to deliver comfortable rooms, clean spaces,
            and guest-friendly service in a premium but approachable lodge setting.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {BRANCHES.map((branch, index) => (
            <motion.article
              key={branch.slug}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="surface-card overflow-hidden"
            >
              <div className="h-56 bg-[linear-gradient(135deg,#0b3d91_0%,#072b66_62%,#d72638_140%)] p-6 text-white">
                <div className="flex h-full items-end rounded-[1.5rem] border border-white/16 bg-white/8 p-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/72">
                      Placeholder Image Area
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold">{branch.name}</h3>
                  </div>
                </div>
              </div>
              <div className="px-6 py-6 sm:px-8">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <MapPinned className="h-4 w-4" />
                  {branch.location}
                </div>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  {branch.description}
                </p>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href="/branches">View Branch</Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
