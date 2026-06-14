import { CheckCircle2, CircleSlash } from "lucide-react";

export function NotificationStatusCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: "configured" | "not_configured" | "info";
}) {
  const isConfigured = status === "configured";
  const isInfo = status === "info";

  return (
    <div className="surface-card rounded-[1.8rem] px-6 py-6">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
            isConfigured
              ? "bg-emerald-50 text-emerald-700"
              : isInfo
                ? "bg-primary/8 text-primary"
                : "bg-accent/8 text-accent"
          }`}
        >
          {isConfigured ? <CheckCircle2 className="h-5 w-5" /> : <CircleSlash className="h-5 w-5" />}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
