import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "danger" | "success" | "warning";
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "bg-white",
  danger: "bg-accent/5",
  success: "bg-emerald-500/5",
  warning: "bg-amber-500/5",
};

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
}: MetricCardProps) {
  return (
    <div className={cn("surface-card px-6 py-6", toneClasses[tone])}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <p className="mt-4 text-4xl font-semibold text-foreground">{value}</p>
      {hint ? (
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
