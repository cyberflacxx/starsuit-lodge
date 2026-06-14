import type { Metadata } from "next";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";
import { SectionHeading } from "@/components/public/section-heading";
import { getAllPublicGalleryImages } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Photo Gallery | Starsuit Lodges Mutare & Chipinge",
  description:
    "Browse photos of Starsuit Lodge Mutare and Chipinge - rooms, lobby, dining, outdoor spaces, and more. See what's waiting for you before you arrive.",
};

export default async function GalleryPage() {
  const images = await getAllPublicGalleryImages();

  return (
    <>
      <PageHero
        eyebrow="Photo Gallery"
        title="See the spaces that await you at Starsuit Lodges."
        description="Browse rooms, common areas, dining spaces, and branch exteriors. Filter by location to focus on the branch you plan to visit."
        actions={[
          { label: "Book a Room", href: "/booking" },
          { label: "View Branches", href: "/branches", variant: "outline" },
        ]}
        imageKey="gallery"
      />

      <section className="section-gap bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow="All Photos"
            title="Mutare and Chipinge - in pictures."
            description="Use the filters below to explore images from a specific branch, or browse everything at once."
          />
          <div className="mt-10">
            <GalleryGrid images={images} enableFilter />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Like What You See?"
        title="The real thing is even better. Book your stay today."
        description="Photos give you a sense of the space - actually being there gives you the full Starsuit experience. Reserve your room online in minutes."
        buttonLabel="Book a Room"
        buttonHref="/booking"
      />
    </>
  );
}
