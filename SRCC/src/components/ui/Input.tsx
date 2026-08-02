import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-btn border border-border bg-surface text-sm text-text",
          "placeholder:text-text-faint",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          icon ? "pl-9 pr-3" : "px-3",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";
