type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  showComingSoon?: boolean;
  items?: Array<{
    title: string;
    description: string;
  }>;
};

export function PageShell({
  eyebrow,
  title,
  description,
  showComingSoon = false,
  items,
}: PageShellProps) {
  return (
    <section className="section-gap">
      <div className="shell">
        <div className="surface-card px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>

          {showComingSoon ? (
            <div className="mt-8 inline-flex rounded-full border border-accent/20 bg-accent/8 px-4 py-2 text-sm font-semibold text-accent">
              Coming in next module
            </div>
          ) : null}

          {items?.length ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div key={item.title} className="rounded-3xl bg-muted p-5">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
