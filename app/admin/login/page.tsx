import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1800&q=85"
        alt="Starsuit Lodges admin login"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,26,51,0.92)_0%,rgba(7,26,51,0.75)_100%)]" />

      {/* Back link */}
      <div className="absolute left-6 top-6 z-10 sm:left-10 sm:top-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Logo + brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src="/images/placeholders/logo.png"
              alt="Starsuit Lodges"
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl object-contain"
            />
            <h1 className="mt-4 font-display text-2xl font-semibold text-white">
              Starsuit Lodges
            </h1>
            <p className="mt-1 text-sm uppercase tracking-[0.22em] text-white/55">
              Staff Portal
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-3xl border border-white/10 bg-white/95 px-8 py-9 shadow-[0_32px_80px_rgba(7,26,51,0.35)] backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Admin Login
                </p>
                <p className="text-xl font-semibold text-foreground">Sign in to your account</p>
              </div>
            </div>

            <div className="mt-6">
              <AdminLoginForm />
            </div>
          </div>

          {/* Role note */}
          <p className="mt-5 text-center text-xs leading-5 text-white/50">
            Access is restricted to authorised Starsuit Lodges staff only.
            <br />
            Role permissions are enforced after login.
          </p>
        </div>
      </div>
    </div>
  );
}
