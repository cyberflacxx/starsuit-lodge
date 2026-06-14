import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPinned, Phone } from "lucide-react";
import { BranchMapPanel } from "@/components/public/branch-map-panel";
import { CtaBand } from "@/components/public/cta-band";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { PageHero } from "@/components/public/page-hero";
import { ServiceCard } from "@/components/public/service-card";
import { getBranchBySlug } from "@/lib/public-data";
import { Button } from "@/components/ui/button";

type BranchDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    return {
      title: "Branch Not Found | Starsuit Lodges",
    };
  }

  return {
    title: `${branch.name} | Starsuit Lodges`,
    description: `${branch.name} in ${branch.city} offers modern Starsuit Lodges accommodation, branch services, and direct booking guidance.`,
  };
}

export default async function BranchDetailPage({ params }: BranchDetailPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow={branch.city}
        title={branch.name}
        description={branch.description}
        actions={[
          {
            label: "Book This Branch",
            href: `/booking?branch=${branch.publicSlug}`,
          },
          {
            label: "All Branches",
            href: "/branches",
            variant: "outline",
          },
        ]}
      />

      <section className="section-gap bg-white">
        <div className="shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="surface-card px-6 py-7 sm:px-8">
              <h2 className="text-3xl font-semibold">Branch details</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                <p className="flex items-start gap-3">
                  <MapPinned className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{branch.address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{branch.phone}</span>
                </p>
                <p>{branch.email}</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href={`/booking?branch=${branch.publicSlug}`}>Book This Branch</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={branch.mapUrl} target="_blank" rel="noreferrer">
                    View Map
                  </Link>
                </Button>
              </div>
            </div>

            <BranchMapPanel
              branchName={branch.name}
              city={branch.city}
              mapUrl={branch.mapUrl}
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold">Services</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {branch.services.length ? (
                branch.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              ) : (
                <div className="surface-card px-6 py-8 text-center md:col-span-2">
                  <p className="text-lg font-semibold">Branch services are being prepared.</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    Content is being prepared. Please check again soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap bg-muted">
        <div className="shell">
          <h2 className="text-4xl font-semibold">Gallery preview</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            Preview visual content for {branch.name}. Placeholder gallery assets are
            shown when curated branch photography is still being prepared.
          </p>
          <div className="mt-10">
            <GalleryGrid images={branch.galleryImages} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Continue to booking for ${branch.city}.`}
        description="Branch-specific booking links are already in place so guests can continue with the correct branch context."
        buttonLabel="Book This Branch"
        buttonHref={`/booking?branch=${branch.publicSlug}`}
      />
    </>
  );
}
