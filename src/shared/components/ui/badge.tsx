import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

// const badgeVariants = cva(
//   "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary/10 text-primary",
//         secondary: "bg-secondary text-secondary-foreground",
//         outline: "border border-border text-foreground",
//         accent: "bg-accent/15 text-foreground",
//         destructive: "bg-destructive/10 text-destructive",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   },
// );
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default:
          "bg-[color:color-mix(in_hsl,hsl(var(--primary))_10%,hsl(var(--background)))] text-primary",

        secondary: "bg-secondary text-secondary-foreground",

        outline: "border border-border text-foreground",

        accent:
          "bg-[color:color-mix(in_hsl,hsl(var(--accent))_15%,hsl(var(--background)))] text-foreground",

        destructive:
          "bg-[color:color-mix(in_hsl,hsl(var(--destructive))_10%,hsl(var(--background)))] text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
