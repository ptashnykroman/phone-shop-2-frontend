import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
}

export function Select({
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-2xl border border-input bg-background px-4 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
