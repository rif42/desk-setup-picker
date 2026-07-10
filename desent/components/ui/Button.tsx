import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 shadow-sm",
  ghost: "bg-transparent hover:bg-foreground/5 text-foreground",
  outline:
    "border border-foreground/15 bg-transparent hover:bg-foreground/5 text-foreground",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 disabled:pointer-events-none disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
});
