import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pageHeroImages } from "@/lib/media-placeholders";

type HeroAction = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary";
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: HeroAction[];
  imageKey?: keyof typeof pageHeroImages;
};

export function PageHero({ eyebrow, title, description, actions, imageKey }: PageHeroProps) {
  const imageSrc = imageKey ? pageHeroImages[imageKey] : null;

  if (imageSrc) {
    return (
      <section className="relative overflow-hidden">
        <div className="relative h-90 sm:h-110 md:h-130 lg:h-145">
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,26,51,0.82),rgba(7,26,51,0.55))]" />
          <div className="absolute inset-0 flex items-end">
            <div className="shell pb-7 pt-24 sm:pb-10 sm:pt-28 md:pb-14">
              <div className="max-w-4xl text-white">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
                  {eyebrow}
                </span>
                <h1 className="mt-3 text-xl font-semibold leading-[1.2] sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  {title}
                </h1>
                <p className="mt-2 hidden max-w-2xl text-xs leading-6 text-white/80 sm:mt-4 sm:block sm:text-sm md:text-base lg:text-lg">
                  {description}
                </p>
                {actions?.length ? (
                  <div className="mt-4 hidden flex-col gap-3 sm:mt-8 sm:flex sm:flex-row sm:gap-4">
                    {actions.map((action) => (
                      <Button
                        key={`${action.href}-${action.label}`}
                        asChild
                        size="lg"
                        variant={action.variant === "outline" ? "secondary" : "default"}
                        className={
                          action.variant === "outline"
                            ? "border-white/30 bg-white/12 text-white hover:bg-white/22"
                            : ""
                        }
                      >
                        <Link href={action.href}>{action.label}</Link>
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Non-image fallback
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(215,38,56,0.12),transparent_24%),linear-gradient(135deg,#f5f8ff_0%,#ffffff_48%,#e9f0ff_100%)]">
      <div className="shell section-gap relative pt-24">
        <div className="max-w-4xl">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-xl">
            {description}
          </p>
          {actions?.length ? (
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
              {actions.map((action) => (
                <Button
                  key={`${action.href}-${action.label}`}
                  asChild
                  size="lg"
                  variant={action.variant ?? "default"}
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
