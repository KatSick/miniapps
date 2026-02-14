import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("font-sans leading-[1.6]", {
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: "text-base",
      small: "text-sm",
    },
    variant: {
      default: "text-text",
      muted: "text-text-muted",
      strong: "text-text-strong font-medium",
    },
  },
});

type TextProps = ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    as?: "p" | "span" | "div";
  };

const Text = ({
  as: Tag = "p",
  children,
  className,
  size,
  variant,
  ...props
}: TextProps): ReactElement => (
  <Tag className={cn(textVariants({ size, variant }), className)} {...props}>
    {children}
  </Tag>
);

export { Text, textVariants };
export type { TextProps };
