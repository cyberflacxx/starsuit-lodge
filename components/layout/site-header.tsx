"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <div className="shell flex min-h-20 items-center justify-between gap-6">
        {/* Logo — left aligned */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/placeholders/logo.png"
            alt="Starsuit Lodges"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-xl object-contain"
            style={{ width: 40, height: 40 }}
          />
          <div>
            <p className="font-display text-xl font-semibold leading-none text-white">
              Starsuit Lodges
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
              Mutare and Chipinge
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {siteConfig.mainNav.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-white text-primary"
                    : "text-white hover:bg-white hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/admin"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/admin" ? "text-white" : "text-white/60 hover:text-white",
            )}
          >
            Admin
          </Link>
          <Link
            href="/booking"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md"
          >
            Book Now
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
