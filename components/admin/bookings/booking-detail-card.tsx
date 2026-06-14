type BookingDetailCardProps = {
  title: string;
  children: React.ReactNode;
};

export function BookingDetailCard({ title, children }: BookingDetailCardProps) {
  return (
    <section className="surface-card px-6 py-6 sm:px-8">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
