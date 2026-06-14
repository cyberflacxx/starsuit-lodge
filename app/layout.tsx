import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

function getMetadataBaseUrl() {
  const candidate = process.env.NEXT_PUBLIC_APP_URL?.trim();

  try {
    return new URL(candidate || "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: "Starsuit Lodges | Mutare and Chipinge Lodge Bookings",
  description:
    "Modern lodge accommodation, room booking, and hospitality services in Mutare and Chipinge.",
  applicationName: siteConfig.name,
  keywords: [
    "Starsuit Lodges",
    "Mutare lodge",
    "Chipinge lodge",
    "Zimbabwe accommodation",
    "lodge booking",
  ],
  openGraph: {
    title: "Starsuit Lodges | Mutare and Chipinge Lodge Bookings",
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
