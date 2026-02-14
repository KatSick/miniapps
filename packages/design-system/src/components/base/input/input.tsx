import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input">;

const Input = ({ className, type = "text", ...props }: InputProps): ReactElement => (
  <input
    type={type}
    className={cn(
      "flex h-9 w-full rounded-md border border-border bg-surface px-3 py-2 font-sans text-sm text-text transition-colors placeholder:text-text-muted",
      "focus:border-border-strong focus:bg-surface-raised focus:ring-2 focus:ring-border-strong focus:ring-offset-2 focus:ring-offset-background focus:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

export { Input };
export type { InputProps };
