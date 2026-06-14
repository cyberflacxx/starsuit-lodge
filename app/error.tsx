"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <section className="shell flex min-h-screen items-center justify-center py-24">
          <div className="surface-card max-w-2xl px-8 py-12 text-center sm:px-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Temporary Problem
            </p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
              Starsuit Lodges hit an unexpected issue.
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Please try again or return to the homepage. Technical details are hidden on purpose.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button type="button" onClick={reset}>
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
