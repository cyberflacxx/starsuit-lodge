type AuditTrailItem = {
  id: string;
  action: string;
  entity: string;
  description: string;
  createdAt: Date;
  metadata: unknown;
};

export function AuditTrailList({ logs }: { logs: AuditTrailItem[] }) {
  if (!logs.length) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-border px-5 py-6 text-sm text-muted-foreground">
        No audit trail entries available for this booking yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="rounded-[1.4rem] border border-border bg-white px-5 py-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-foreground">{log.action}</p>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {log.entity}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "UTC",
              }).format(log.createdAt)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{log.description}</p>
          {log.metadata ? (
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          ) : null}
        </div>
      ))}
    </div>
  );
}
