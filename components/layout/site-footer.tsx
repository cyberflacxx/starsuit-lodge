import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com" },
];

const footerLinks = {
  "Our Branches": [
    { label: "Starsuit Lodge Mutare", href: "/branches/mutare" },
    { label: "Starsuit Lodge Chipinge", href: "/branches/chipinge" },
    { label: "Explore All Branches", href: "/branches" },
  ],
  "Guest Info": [
    { label: "Rooms & Rates", href: "/rooms" },
    { label: "Photo Gallery", href: "/gallery" },
    { label: "About Starsuit Lodges", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  "Book a Stay": [
    { label: "Check Availability", href: "/booking" },
    { label: "Standard Rooms", href: "/booking?roomType=standard-room" },
    { label: "Deluxe Rooms", href: "/booking?roomType=deluxe-room" },
    { label: "Executive Rooms", href: "/booking?roomType=executive-room" },
  ],
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white">
      <div className="shell pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-16 lg:pb-12">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/images/placeholders/logo.png"
                alt="Starsuit Lodges"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-xl object-contain"
                style={{ width: 40, height: 40 }}
              />
              <p className="font-display text-xl font-semibold">{siteConfig.name}</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/68">
              Premium lodge accommodation across Zimbabwe&apos;s eastern highlands - in Mutare and Chipinge. Comfortable rooms, genuine hospitality, easy online booking.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2.5 text-sm text-white/75">
              <a href="tel:+263788064458" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5 shrink-0 text-white/50" />
                +263 78 806 4458
              </a>
              <a href="mailto:bookings@starsuitlodges.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5 shrink-0 text-white/50" />
                bookings@starsuitlodges.com
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50" />
                Mutare & Chipinge, Zimbabwe
              </p>
            </div>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                {heading}
              </p>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Check-in info bar */}
        <div className="mt-12 grid gap-4 rounded-2xl bg-white/6 px-6 py-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Check-in</p>
            <p className="mt-1 text-sm font-semibold">From 2:00 PM</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Check-out</p>
            <p className="mt-1 text-sm font-semibold">By 10:00 AM</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Support hours</p>
            <p className="mt-1 text-sm font-semibold">Mon – Sun, 6 AM – 10 PM</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-white/80 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white/80 transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-white/80 transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
