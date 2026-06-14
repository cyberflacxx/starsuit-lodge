"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BedDouble, Bell, Building2, CreditCard, FileText, Frame, ImageIcon, LayoutDashboard, Search, Settings, BarChart3 } from "lucide-react";
import type { AdminNavItem } from "@/types";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  bookings: Frame,
  content: FileText,
  notifications: Bell,
  reports: BarChart3,
  rooms: BedDouble,
  availability: Search,
  branches: Building2,
  payments: CreditCard,
  gallery: ImageIcon,
  settings: Settings,
} as const;

type AdminNavProps = {
  items: AdminNavItem[];
};

export function AdminNav({ items }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 grid gap-2">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-white",
              isActive && "bg-primary text-white shadow-sm",
              item.disabled && "pointer-events-none opacity-60",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
