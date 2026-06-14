import type { BookingStep } from "@/types";

type BookingStepsProps = {
  steps: BookingStep[];
};

export function BookingSteps({ steps }: BookingStepsProps) {
  return (
    <div className="rounded-3xl bg-muted p-6 sm:p-7">
      <h2 className="text-xl font-semibold">Booking steps</h2>
      <ol className="mt-5 space-y-4">
        {steps.map((step) => (
          <li key={step.id} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {step.order}
            </span>
            <div>
              <p className="text-base font-semibold">{step.title}</p>
              <p className="mt-1 text-sm leading-7 text-muted-foreground sm:text-base">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
