"use client";

type ReportEmptyStateProps = {
  title: string;
  description: string;
};

export function ReportEmptyState({
  title,
  description,
}: ReportEmptyStateProps) {
  return (
    <div className="rounded-[1.6rem] border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}
