"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PublicGalleryImage } from "@/lib/public-data";
import { cn } from "@/lib/utils";

type GalleryGridProps = {
  images: PublicGalleryImage[];
  enableFilter?: boolean;
  limit?: number;
};

const FILTER_OPTIONS = [
  { label: "All Photos", value: "all" },
  { label: "Mutare", value: "mutare" },
  { label: "Chipinge", value: "chipinge" },
] as const;

type FilterValue = (typeof FILTER_OPTIONS)[number]["value"];

export function GalleryGrid({ images, enableFilter = false, limit }: GalleryGridProps) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const sourceImages = useMemo(() => images, [images]);

  const filteredImages = useMemo(() => {
    const base = limit ? sourceImages.slice(0, limit) : sourceImages;
    if (filter === "all") return base;
    return base.filter((img) => img.branchSlug === filter);
  }, [filter, sourceImages, limit]);

  return (
    <div>
      {enableFilter && (
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-semibold transition-all",
                filter === opt.value
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-white text-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {opt.label}
            </button>
          ))}
          <span className="ml-auto self-center text-sm text-muted-foreground">
            {filteredImages.length} photo{filteredImages.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {filteredImages.length === 0 ? (
        <div className="surface-card mt-6 px-6 py-12 text-center">
          <p className="text-lg font-semibold">No photos in this category yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon - we&apos;re adding new images regularly.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredImages.map((image, idx) => (
            <figure
              key={image.id}
              className={cn(
                "group relative overflow-hidden rounded-3xl bg-muted",
                // Make first image span 2 columns on large screens for visual interest
                idx === 0 && !limit ? "xl:col-span-2" : "",
              )}
            >
              <div className={cn("relative w-full overflow-hidden", idx === 0 && !limit ? "h-80" : "h-64")}>
                <Image
                  src={image.imageUrl}
                  alt={image.altText}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={
                    idx === 0 && !limit
                      ? "(max-width: 1280px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  }
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(7,26,51,0.72))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-base font-semibold leading-tight">{image.title}</p>
                  <p className="mt-1 text-xs text-white/80">{image.branchName ?? "Starsuit Lodges"}</p>
                </div>
              </div>
              <figcaption className="px-5 py-4">
                <p className="font-semibold leading-tight">{image.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {image.branchName ?? "Starsuit Lodges"}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
