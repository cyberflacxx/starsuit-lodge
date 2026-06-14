type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="surface-card px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
