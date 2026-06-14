import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default:
    "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary-deep",
  outline:
    "border border-border bg-white text-foreground hover:-translate-y-0.5 hover:border-accent hover:text-accent",
  secondary:
    "bg-white text-primary hover:-translate-y-0.5 hover:bg-muted",
} as const;

const buttonSizes = {
  default: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm sm:text-base",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function Button({
  children,
  className,
  asChild = false,
  variant = "default",
  size = "default",
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold shadow-sm outline-none ring-0 focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className),
    });
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
