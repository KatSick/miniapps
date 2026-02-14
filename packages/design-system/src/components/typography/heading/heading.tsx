import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("font-mono font-semibold tracking-tight text-text-strong", {
  defaultVariants: {
    level: 1,
  },
  variants: {
    level: {
      1: "text-[2rem] leading-[1.3]",
      2: "text-[1.5rem] leading-[1.3]",
      3: "text-[1.25rem] leading-[1.3] font-medium",
      4: "text-[1rem] leading-[1.3] font-medium",
    },
  },
});

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = Omit<ComponentProps<"h1">, "children"> &
  VariantProps<typeof headingVariants> & {
    children: React.ReactNode;
    level?: HeadingLevel;
    showPrompt?: boolean;
  };

const Heading = ({
  children,
  className,
  level = 1,
  showPrompt = true,
  ...props
}: HeadingProps): ReactElement => {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(headingVariants({ level }), showPrompt && "prompt-prefix", className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export { Heading, headingVariants };
export type { HeadingProps };
