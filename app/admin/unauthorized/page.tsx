import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUnauthorizedPage() {
  return (
    <section className="shell flex min-h-screen items-center justify-center py-16">
      <div className="surface-card max-w-2xl px-8 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <ShieldX className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Access Denied
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Your account is authenticated but blocked from the admin portal.
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
          Your account is authenticated but has not been granted access to the
          Starsuit Lodges admin portal.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/admin/login">Back to login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
