import { ArrowLeftRight, BadgeCheck, Smartphone, WalletCards } from "lucide-react";

const steps = [
  {
    title: "Review booking summary",
    description: "Confirm the room, dates, and total before starting the demo payment.",
    icon: WalletCards,
  },
  {
    title: "Click Pay Now",
    description: "Reveal the mock EcoCash dialer action for this booking.",
    icon: Smartphone,
  },
  {
    title: "Tap EcoCash USSD Button",
    description: "Open the demo USSD flow on your phone and complete the mobile confirmation.",
    icon: BadgeCheck,
  },
  {
    title: "Return and click I Have Paid",
    description: "Mark the payment as pending verification so the lodge team can review it later.",
    icon: ArrowLeftRight,
  },
];

export function PaymentInstructions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {steps.map((step, index) => {
        const Icon = step.icon;

        return (
          <div
            key={step.title}
            className="rounded-[1.6rem] border border-border bg-white px-5 py-5 shadow-[0_12px_35px_rgba(7,26,51,0.06)]"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
