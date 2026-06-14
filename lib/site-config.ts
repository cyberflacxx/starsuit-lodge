import { BRANCHES } from "@/lib/constants";
import type { NavItem, SiteConfig } from "@/types";

const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Branches", href: "/branches" },
  { label: "Rooms", href: "/rooms" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Book Now", href: "/booking" },
];

export const siteConfig: SiteConfig = {
  name: "Starsuit Lodges",
  description:
    "Modern lodge accommodation, room booking, and hospitality services in Mutare and Chipinge.",
  mainNav,
  branches: BRANCHES,
  contact: {
    phone: "+263 78 806 4458",
    email: "starsuitmutare@gmail.com",
  },
  colors: {
    primary: "#0B3D91",
    primaryDeep: "#072B66",
    accent: "#D72638",
    background: "#FFFFFF",
    muted: "#F5F8FF",
    foreground: "#071A33",
  },
};
