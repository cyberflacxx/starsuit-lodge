import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPinned, Phone } from "lucide-react";
import type { PublicBranch } from "@/lib/public-data";
import { Button } from "@/components/ui/button";
import { branchPlaceholderImages } from "@/lib/media-placeholders";

type BranchCardProps = {
  branch: PublicBranch;
  showAddress?: boolean;
};

export function BranchCard({ branch, showAddress = true }: BranchCardProps) {
  const imageSrc = branchPlaceholderImages[branch.publicSlug] ?? "/images/stock/mutare-exterior.jpg";

  return (
    <article className="surface-card overflow-hidden">
      <div className="relative h-56">
        <Image
          src={imageSrc}
          alt={`${branch.name} exterior preview`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,51,0.08),rgba(7,26,51,0.55))]" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <span className="inline-flex rounded-full bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/82">
            Branch Stay
          </span>
          <p className="text-sm uppercase tracking-[0.24em] text-white/74">{branch.city}</p>
          <h3 className="mt-2 text-3xl font-semibold">{branch.name}</h3>
        </div>
      </div>
      <div className="space-y-4 px-6 py-6 sm:px-8">
        <p className="text-base leading-8 text-muted-foreground">{branch.description}</p>
        <div className="grid gap-3 text-sm text-foreground/88">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            {branch.phone}
          </p>
          {showAddress ? (
            <p className="flex items-start gap-2">
              <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{branch.address}</span>
            </p>
          ) : null}
          <p className="text-sm text-muted-foreground">{branch.email}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={`/branches/${branch.publicSlug}`}>View Branch</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/booking?branch=${branch.publicSlug}`}>
              Book This Branch
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
