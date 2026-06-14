import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BookingProgressProps = {
  currentStep: number;
  steps: string[];
};

export function BookingProgress({ currentStep, steps }: BookingProgressProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div
            key={step}
            className={cn(
              "rounded-[1.6rem] border px-4 py-4 shadow-[0_12px_35px_rgba(7,26,51,0.06)]",
              isCurrent
                ? "border-primary/20 bg-primary text-primary-foreground"
                : "border-border bg-white",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                  isCurrent
                    ? "border-white/40 bg-white/15 text-white"
                    : isComplete
                      ? "border-primary/20 bg-primary/8 text-primary"
                      : "border-border bg-muted text-muted-foreground",
                )}
              >
                {isComplete ? <CheckCircle2 className="h-4 w-4" /> : stepNumber}
              </span>
              <div>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.18em]",
                    isCurrent ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  Step {stepNumber}
                </p>
                <p className={cn("text-sm font-semibold", isCurrent ? "text-white" : "text-foreground")}>
                  {step}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
