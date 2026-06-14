import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  tone?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "muted"
    | "draft"
    | "published"
    | "archived"
    | "featured"
    | "inactive"
    | "available"
    | "occupied"
    | "maintenance"
    | "blocked";
};

const toneClasses: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  primary: "border-primary/15 bg-primary/8 text-primary",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  danger: "border-accent/20 bg-accent/8 text-accent",
  muted: "border-border bg-muted text-muted-foreground",
  draft: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  published: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  archived: "border-slate-300 bg-slate-100 text-slate-700",
  featured: "border-primary/15 bg-primary/8 text-primary",
  inactive: "border-border bg-muted text-muted-foreground",
  available: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  occupied: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  maintenance: "border-primary/15 bg-primary/8 text-primary",
  blocked: "border-accent/20 bg-accent/8 text-accent",
};

export function StatusBadge({ label, tone = "primary" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        toneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}
