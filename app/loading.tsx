export default function Loading() {
  return (
    <div className="shell flex min-h-[60vh] items-center justify-center py-24">
      <div className="surface-card flex w-full max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-primary/15" />
        <div className="space-y-2">
          <p className="text-lg font-semibold text-primary">Preparing Starsuit Lodges</p>
          <p className="text-sm text-muted-foreground">
            Loading the lodge experience for Mutare and Chipinge.
          </p>
        </div>
      </div>
    </div>
  );
}
