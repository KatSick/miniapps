import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement } from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-mono text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-4 py-2",
        icon: "size-9",
        lg: "h-11 px-6",
        sm: "h-7 px-3 text-xs",
      },
      variant: {
        default: "bg-text-strong text-background hover:bg-text",
        ghost: "hover:bg-surface-raised hover:text-text-strong",
        link: "text-text underline-offset-4 underline decoration-dashed hover:decoration-solid",
        secondary: "border border-border bg-transparent text-text hover:bg-surface-raised",
      },
    },
  },
);

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }): ReactElement => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({
          className,
          size,
          variant,
        }),
      )}
      {...props}
    />
  );
};

export { Button, buttonVariants };
