import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type CodeProps = ComponentProps<"code">;

const Code = ({ children, className, ...props }: CodeProps): ReactElement => (
  <code
    className={cn(
      "rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-sm",
      className,
    )}
    {...props}
  >
    {children}
  </code>
);

type CodeBlockProps = ComponentProps<"pre"> & {
  filename?: string;
};

const CodeBlock = ({ children, className, filename, ...props }: CodeBlockProps): ReactElement => (
  <div className="overflow-hidden rounded-md border border-border">
    {typeof filename === "string" && filename.length > 0 && (
      <div className="border-b border-border bg-surface-raised px-4 py-2">
        <span className="font-mono text-sm text-text-muted">{filename}</span>
      </div>
    )}
    <pre className={cn("overflow-x-auto bg-surface p-4", className)} {...props}>
      <code className="font-mono text-sm">{children}</code>
    </pre>
  </div>
);

export { Code, CodeBlock };
export type { CodeBlockProps, CodeProps };
