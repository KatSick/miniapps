import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type CodeProps = ComponentProps<"code">;

const Code = ({ children, className, ...props }: CodeProps): ReactElement => (
  <code
    className={cn(
      "font-mono text-sm bg-surface px-1.5 py-0.5 rounded-sm border border-border",
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
  <div className="rounded-md border border-border overflow-hidden">
    {typeof filename === "string" && filename.length > 0 && (
      <div className="bg-surface-raised px-4 py-2 border-b border-border">
        <span className="font-mono text-sm text-text-muted">{filename}</span>
      </div>
    )}
    <pre className={cn("bg-surface p-4 overflow-x-auto", className)} {...props}>
      <code className="font-mono text-sm">{children}</code>
    </pre>
  </div>
);

export { Code, CodeBlock };
export type { CodeBlockProps, CodeProps };
