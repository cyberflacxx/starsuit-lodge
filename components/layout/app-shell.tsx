"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {isAdminRoute ? null : <SiteHeader />}
      <main className={isAdminRoute ? "flex-1" : "flex-1 -mt-20"}>{children}</main>
      {isAdminRoute ? null : <SiteFooter />}
    </div>
  );
}
