"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Toggle navigation"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white hover:bg-white hover:text-primary transition-all"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-primary/90 backdrop-blur-md px-4 pb-5 pt-3 shadow-xl"
        >
          <nav className="shell grid gap-1.5 px-0">
            {siteConfig.mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-white text-primary"
                      : "text-white hover:bg-white hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                pathname === "/admin"
                  ? "text-white"
                  : "text-white/60 hover:text-white",
              )}
            >
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
