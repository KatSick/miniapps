# Terminal Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimal grey terminal-style design system and blog using monochrome colors, mixed typography (mono headers, sans body), and subtle terminal hints.

**Architecture:** Replace existing shadcn color tokens with neutral grey scale. Add JetBrains Mono + Inter fonts. Build components following CVA patterns already established. Blog uses single-column centered layout.

**Tech Stack:** React 19, Tailwind CSS v4, class-variance-authority, Radix UI primitives, Vitest browser testing

---

## Phase 1: Foundation

### Task 1.1: Update CSS Tokens

**Files:**
- Modify: `packages/design-system/src/assets/tailwind.css`

**Step 1: Replace color tokens with terminal grey scale**

Replace the entire `:root` and `.dark` blocks with the new terminal tokens:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Terminal Grey Scale - Light Mode */
  --background: #fafafa;
  --foreground: #171717;
  --surface: #f0f0f0;
  --surface-raised: #e5e5e5;
  --border: #d4d4d4;
  --border-strong: #a3a3a3;
  --text-muted: #737373;
  --text: #171717;
  --text-strong: #000000;

  /* Typography */
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* Spacing */
  --space-section: 4rem;
  --space-block: 1.5rem;

  /* Radius - minimal for terminal feel */
  --radius: 4px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;

  /* Legacy mappings for existing components */
  --card: var(--surface);
  --card-foreground: var(--text);
  --popover: var(--surface);
  --popover-foreground: var(--text);
  --primary: var(--text-strong);
  --primary-foreground: var(--background);
  --secondary: var(--surface);
  --secondary-foreground: var(--text);
  --muted: var(--surface);
  --muted-foreground: var(--text-muted);
  --accent: var(--surface-raised);
  --accent-foreground: var(--text);
  --destructive: var(--text);
  --destructive-foreground: var(--background);
  --input: var(--surface);
  --ring: var(--border-strong);
}

.dark {
  /* Terminal Grey Scale - Dark Mode */
  --background: #0a0a0a;
  --foreground: #e5e5e5;
  --surface: #141414;
  --surface-raised: #1f1f1f;
  --border: #262626;
  --border-strong: #404040;
  --text-muted: #737373;
  --text: #e5e5e5;
  --text-strong: #ffffff;

  /* Legacy mappings */
  --card: var(--surface);
  --card-foreground: var(--text);
  --popover: var(--surface);
  --popover-foreground: var(--text);
  --primary: var(--text-strong);
  --primary-foreground: var(--background);
  --secondary: var(--surface);
  --secondary-foreground: var(--text);
  --muted: var(--surface);
  --muted-foreground: var(--text-muted);
  --accent: var(--surface-raised);
  --accent-foreground: var(--text);
  --destructive: var(--text);
  --destructive-foreground: var(--background);
  --input: var(--surface);
  --ring: var(--border-strong);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-text-muted: var(--text-muted);
  --color-text: var(--text);
  --color-text-strong: var(--text-strong);
  --font-family-mono: var(--font-mono);
  --font-family-sans: var(--font-sans);

  /* Legacy theme mappings */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
}

/* Terminal utilities */
@layer utilities {
  .font-mono {
    font-family: var(--font-mono);
  }
  .font-sans {
    font-family: var(--font-sans);
  }
  .prompt-prefix::before {
    content: '> ';
    @apply text-text-muted;
  }
  @keyframes cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  .cursor-blink::after {
    content: '▌';
    @apply text-text-muted animate-[cursor-blink_1s_steps(1)_infinite];
  }
}
```

**Step 2: Verify build passes**

Run: `moon design-system:build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add packages/design-system/src/assets/tailwind.css
git commit -m "feat(design-system): add terminal grey color tokens and utilities"
```

---

### Task 1.2: Add Font Loading

**Files:**
- Modify: `apps/blog-fe/index.html`

**Step 1: Add Google Fonts links**

Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**Step 2: Verify dev server works**

Run: `moon :dev`
Expected: App loads with new fonts

**Step 3: Commit**

```bash
git add apps/blog-fe/index.html
git commit -m "feat(blog-fe): add JetBrains Mono and Inter font loading"
```

---

## Phase 2: Typography Components

### Task 2.1: Create Heading Component

**Files:**
- Create: `packages/design-system/src/components/typography/heading/heading.tsx`
- Create: `packages/design-system/src/components/typography/heading/heading.test.tsx`
- Create: `packages/design-system/src/components/typography/heading/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/typography/heading/heading.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Heading } from "./heading";

describe("Heading", () => {
  it("renders h1 with prompt prefix by default", async () => {
    const { getByRole } = render(<Heading>Test Title</Heading>);
    const heading = getByRole("heading", { level: 1 });
    await expect.element(heading).toBeInTheDocument();
    await expect.element(heading).toHaveClass("font-mono");
  });

  it("renders correct heading level", async () => {
    const { getByRole } = render(<Heading level={2}>Section</Heading>);
    const heading = getByRole("heading", { level: 2 });
    await expect.element(heading).toBeInTheDocument();
  });

  it("can hide prompt prefix", async () => {
    const { getByRole } = render(<Heading showPrompt={false}>No Prompt</Heading>);
    const heading = getByRole("heading", { level: 1 });
    await expect.element(heading).not.toHaveClass("prompt-prefix");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL - module not found

**Step 3: Create heading component**

Create `packages/design-system/src/components/typography/heading/heading.tsx`:

```tsx
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
```

**Step 4: Create index export**

Create `packages/design-system/src/components/typography/heading/index.ts`:

```ts
export { Heading, headingVariants } from "./heading";
export type { HeadingProps } from "./heading";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/typography/heading/
git commit -m "feat(design-system): add Heading component with prompt prefix"
```

---

### Task 2.2: Create Text Component

**Files:**
- Create: `packages/design-system/src/components/typography/text/text.tsx`
- Create: `packages/design-system/src/components/typography/text/text.test.tsx`
- Create: `packages/design-system/src/components/typography/text/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/typography/text/text.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Text } from "./text";

describe("Text", () => {
  it("renders paragraph with sans font by default", async () => {
    const { getByText } = render(<Text>Hello world</Text>);
    const text = getByText("Hello world");
    await expect.element(text).toBeInTheDocument();
    await expect.element(text).toHaveClass("font-sans");
  });

  it("renders muted variant", async () => {
    const { getByText } = render(<Text variant="muted">Muted text</Text>);
    const text = getByText("Muted text");
    await expect.element(text).toHaveClass("text-text-muted");
  });

  it("renders small size", async () => {
    const { getByText } = render(<Text size="small">Small text</Text>);
    const text = getByText("Small text");
    await expect.element(text).toHaveClass("text-sm");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create text component**

Create `packages/design-system/src/components/typography/text/text.tsx`:

```tsx
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
}: TextProps): ReactElement => {
  return (
    <Tag className={cn(textVariants({ size, variant }), className)} {...props}>
      {children}
    </Tag>
  );
};

export { Text, textVariants };
export type { TextProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/typography/text/index.ts`:

```ts
export { Text, textVariants } from "./text";
export type { TextProps } from "./text";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/typography/text/
git commit -m "feat(design-system): add Text component with variants"
```

---

### Task 2.3: Create Code Component

**Files:**
- Create: `packages/design-system/src/components/typography/code/code.tsx`
- Create: `packages/design-system/src/components/typography/code/code.test.tsx`
- Create: `packages/design-system/src/components/typography/code/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/typography/code/code.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Code, CodeBlock } from "./code";

describe("Code", () => {
  it("renders inline code with mono font", async () => {
    const { getByText } = render(<Code>const x = 1</Code>);
    const code = getByText("const x = 1");
    await expect.element(code).toBeInTheDocument();
    await expect.element(code).toHaveClass("font-mono");
  });
});

describe("CodeBlock", () => {
  it("renders code block with surface background", async () => {
    const { container } = render(<CodeBlock>function test() {}</CodeBlock>);
    const pre = container.querySelector("pre");
    expect(pre).not.toBeNull();
  });

  it("shows filename when provided", async () => {
    const { getByText } = render(<CodeBlock filename="test.ts">code</CodeBlock>);
    const filename = getByText("test.ts");
    await expect.element(filename).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create code component**

Create `packages/design-system/src/components/typography/code/code.tsx`:

```tsx
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type CodeProps = ComponentProps<"code">;

const Code = ({ children, className, ...props }: CodeProps): ReactElement => {
  return (
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
};

type CodeBlockProps = ComponentProps<"pre"> & {
  filename?: string;
};

const CodeBlock = ({ children, className, filename, ...props }: CodeBlockProps): ReactElement => {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      {filename && (
        <div className="bg-surface-raised px-4 py-2 border-b border-border">
          <span className="font-mono text-sm text-text-muted">{filename}</span>
        </div>
      )}
      <pre className={cn("bg-surface p-4 overflow-x-auto", className)} {...props}>
        <code className="font-mono text-sm">{children}</code>
      </pre>
    </div>
  );
};

export { Code, CodeBlock };
export type { CodeBlockProps, CodeProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/typography/code/index.ts`:

```ts
export { Code, CodeBlock } from "./code";
export type { CodeBlockProps, CodeProps } from "./code";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/typography/code/
git commit -m "feat(design-system): add Code and CodeBlock components"
```

---

### Task 2.4: Export Typography Components

**Files:**
- Modify: `packages/design-system/src/index.ts`

**Step 1: Add exports**

Update `packages/design-system/src/index.ts`:

```ts
export { Button } from "./components/base/button/button";
export { Code, CodeBlock } from "./components/typography/code";
export { Heading } from "./components/typography/heading";
export { Text } from "./components/typography/text";
```

**Step 2: Verify build**

Run: `moon design-system:build`
Expected: PASS

**Step 3: Commit**

```bash
git add packages/design-system/src/index.ts
git commit -m "feat(design-system): export typography components"
```

---

## Phase 3: Base Components

### Task 3.1: Update Button for Terminal Style

**Files:**
- Modify: `packages/design-system/src/components/base/button/button.tsx`
- Modify: `packages/design-system/src/components/base/button/button.test.tsx`

**Step 1: Update button variants**

Replace the `buttonVariants` in `packages/design-system/src/components/base/button/button.tsx`:

```tsx
// oxlint-disable jsx-props-no-spreading
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
```

**Step 2: Run existing test**

Run: `moon design-system:test`
Expected: PASS (existing test should still pass)

**Step 3: Commit**

```bash
git add packages/design-system/src/components/base/button/button.tsx
git commit -m "feat(design-system): update Button to terminal monochrome style"
```

---

### Task 3.2: Create Input Component

**Files:**
- Create: `packages/design-system/src/components/base/input/input.tsx`
- Create: `packages/design-system/src/components/base/input/input.test.tsx`
- Create: `packages/design-system/src/components/base/input/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/base/input/input.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("renders input with surface background", async () => {
    const { getByRole } = render(<Input placeholder="Enter text" />);
    const input = getByRole("textbox");
    await expect.element(input).toBeInTheDocument();
    await expect.element(input).toHaveClass("bg-surface");
  });

  it("applies focus styles", async () => {
    const { getByRole } = render(<Input />);
    const input = getByRole("textbox");
    await expect.element(input).toHaveClass("focus:bg-surface-raised");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create input component**

Create `packages/design-system/src/components/base/input/input.tsx`:

```tsx
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input">;

const Input = ({ className, type = "text", ...props }: InputProps): ReactElement => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-sans text-text placeholder:text-text-muted transition-colors",
        "focus:bg-surface-raised focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-border-strong focus:ring-offset-2 focus:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};

export { Input };
export type { InputProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/base/input/index.ts`:

```ts
export { Input } from "./input";
export type { InputProps } from "./input";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/base/input/
git commit -m "feat(design-system): add Input component"
```

---

### Task 3.3: Create Link Component

**Files:**
- Create: `packages/design-system/src/components/base/link/link.tsx`
- Create: `packages/design-system/src/components/base/link/link.test.tsx`
- Create: `packages/design-system/src/components/base/link/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/base/link/link.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Link } from "./link";

describe("Link", () => {
  it("renders link with dashed underline", async () => {
    const { getByRole } = render(<Link href="#">Click me</Link>);
    const link = getByRole("link");
    await expect.element(link).toBeInTheDocument();
    await expect.element(link).toHaveClass("underline");
    await expect.element(link).toHaveClass("decoration-dashed");
  });

  it("has solid underline on hover class", async () => {
    const { getByRole } = render(<Link href="#">Hover me</Link>);
    const link = getByRole("link");
    await expect.element(link).toHaveClass("hover:decoration-solid");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create link component**

Create `packages/design-system/src/components/base/link/link.tsx`:

```tsx
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type LinkProps = ComponentProps<"a">;

const Link = ({ children, className, ...props }: LinkProps): ReactElement => {
  return (
    <a
      className={cn(
        "text-text underline underline-offset-4 decoration-dashed transition-colors",
        "hover:decoration-solid hover:text-text-strong",
        "focus:outline-none focus:ring-2 focus:ring-border-strong focus:ring-offset-2 focus:ring-offset-background rounded-sm",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export { Link };
export type { LinkProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/base/link/index.ts`:

```ts
export { Link } from "./link";
export type { LinkProps } from "./link";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/base/link/
git commit -m "feat(design-system): add Link component with dashed underline"
```

---

### Task 3.4: Create Card Component

**Files:**
- Create: `packages/design-system/src/components/base/card/card.tsx`
- Create: `packages/design-system/src/components/base/card/card.test.tsx`
- Create: `packages/design-system/src/components/base/card/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/base/card/card.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Card, CardContent, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("renders card with surface background", async () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("bg-surface")).toBe(true);
  });

  it("renders card with border", async () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("border")).toBe(true);
  });
});

describe("CardHeader", () => {
  it("renders header with title", async () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>,
    );
    const title = getByText("Test Title");
    await expect.element(title).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create card component**

Create `packages/design-system/src/components/base/card/card.tsx`:

```tsx
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div">;

const Card = ({ children, className, ...props }: CardProps): ReactElement => {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-md transition-colors",
        "hover:bg-surface-raised",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type CardHeaderProps = ComponentProps<"div">;

const CardHeader = ({ children, className, ...props }: CardHeaderProps): ReactElement => {
  return (
    <div className={cn("p-4 border-b border-border", className)} {...props}>
      {children}
    </div>
  );
};

type CardTitleProps = ComponentProps<"h3">;

const CardTitle = ({ children, className, ...props }: CardTitleProps): ReactElement => {
  return (
    <h3
      className={cn("font-mono font-medium text-text-strong prompt-prefix", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

type CardContentProps = ComponentProps<"div">;

const CardContent = ({ children, className, ...props }: CardContentProps): ReactElement => {
  return (
    <div className={cn("p-4 font-sans text-text", className)} {...props}>
      {children}
    </div>
  );
};

type CardFooterProps = ComponentProps<"div">;

const CardFooter = ({ children, className, ...props }: CardFooterProps): ReactElement => {
  return (
    <div className={cn("p-4 border-t border-border", className)} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent, CardFooter, CardHeader, CardTitle };
export type { CardContentProps, CardFooterProps, CardHeaderProps, CardProps, CardTitleProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/base/card/index.ts`:

```ts
export { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
export type {
  CardContentProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from "./card";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/base/card/
git commit -m "feat(design-system): add Card component family"
```

---

### Task 3.5: Export Base Components

**Files:**
- Modify: `packages/design-system/src/index.ts`

**Step 1: Add exports**

Update `packages/design-system/src/index.ts`:

```ts
export { Button } from "./components/base/button/button";
export { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/base/card";
export { Input } from "./components/base/input";
export { Link } from "./components/base/link";
export { Code, CodeBlock } from "./components/typography/code";
export { Heading } from "./components/typography/heading";
export { Text } from "./components/typography/text";
```

**Step 2: Verify build**

Run: `moon design-system:build`
Expected: PASS

**Step 3: Commit**

```bash
git add packages/design-system/src/index.ts
git commit -m "feat(design-system): export base components"
```

---

## Phase 4: Layout Components

### Task 4.1: Create Container Component

**Files:**
- Create: `packages/design-system/src/components/layout/container/container.tsx`
- Create: `packages/design-system/src/components/layout/container/container.test.tsx`
- Create: `packages/design-system/src/components/layout/container/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/layout/container/container.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Container } from "./container";

describe("Container", () => {
  it("renders with max-width for prose", async () => {
    const { container } = render(<Container>Content</Container>);
    const div = container.firstChild as HTMLElement;
    expect(div.classList.contains("max-w-prose")).toBe(true);
  });

  it("centers content", async () => {
    const { container } = render(<Container>Content</Container>);
    const div = container.firstChild as HTMLElement;
    expect(div.classList.contains("mx-auto")).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create container component**

Create `packages/design-system/src/components/layout/container/container.tsx`:

```tsx
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentProps<"div"> & {
  size?: "prose" | "wide" | "full";
};

const Container = ({
  children,
  className,
  size = "prose",
  ...props
}: ContainerProps): ReactElement => {
  const sizeClasses = {
    full: "max-w-full",
    prose: "max-w-prose",
    wide: "max-w-4xl",
  };

  return (
    <div className={cn("mx-auto px-4", sizeClasses[size], className)} {...props}>
      {children}
    </div>
  );
};

export { Container };
export type { ContainerProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/layout/container/index.ts`:

```ts
export { Container } from "./container";
export type { ContainerProps } from "./container";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/layout/container/
git commit -m "feat(design-system): add Container component"
```

---

### Task 4.2: Create Header Component

**Files:**
- Create: `packages/design-system/src/components/layout/header/header.tsx`
- Create: `packages/design-system/src/components/layout/header/header.test.tsx`
- Create: `packages/design-system/src/components/layout/header/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/layout/header/header.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Header } from "./header";

describe("Header", () => {
  it("renders header element", async () => {
    const { container } = render(<Header logo="blog.name">Nav</Header>);
    const header = container.querySelector("header");
    expect(header).not.toBeNull();
  });

  it("renders logo with prompt prefix", async () => {
    const { getByText } = render(<Header logo="blog.name">Nav</Header>);
    const logo = getByText("blog.name");
    await expect.element(logo).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create header component**

Create `packages/design-system/src/components/layout/header/header.tsx`:

```tsx
import type { ComponentProps, ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeaderProps = Omit<ComponentProps<"header">, "children"> & {
  children?: ReactNode;
  logo: string;
  logoHref?: string;
};

const Header = ({
  children,
  className,
  logo,
  logoHref = "/",
  ...props
}: HeaderProps): ReactElement => {
  return (
    <header
      className={cn("border-b border-border bg-background", className)}
      {...props}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <a
          href={logoHref}
          className="font-mono font-semibold text-text-strong prompt-prefix hover:text-text transition-colors"
        >
          {logo}
        </a>
        {children && <nav className="flex items-center gap-6">{children}</nav>}
      </div>
    </header>
  );
};

export { Header };
export type { HeaderProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/layout/header/index.ts`:

```ts
export { Header } from "./header";
export type { HeaderProps } from "./header";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/layout/header/
git commit -m "feat(design-system): add Header component"
```

---

### Task 4.3: Create Footer Component

**Files:**
- Create: `packages/design-system/src/components/layout/footer/footer.tsx`
- Create: `packages/design-system/src/components/layout/footer/footer.test.tsx`
- Create: `packages/design-system/src/components/layout/footer/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/layout/footer/footer.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Footer } from "./footer";

describe("Footer", () => {
  it("renders footer element", async () => {
    const { container } = render(<Footer>Copyright</Footer>);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
  });

  it("renders with muted text", async () => {
    const { getByText } = render(<Footer>2026</Footer>);
    const text = getByText("2026");
    await expect.element(text).toHaveClass("text-text-muted");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create footer component**

Create `packages/design-system/src/components/layout/footer/footer.tsx`:

```tsx
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type FooterProps = ComponentProps<"footer">;

const Footer = ({ children, className, ...props }: FooterProps): ReactElement => {
  return (
    <footer className={cn("border-t border-border bg-background py-8", className)} {...props}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="font-mono text-sm text-text-muted">{children}</div>
      </div>
    </footer>
  );
};

export { Footer };
export type { FooterProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/layout/footer/index.ts`:

```ts
export { Footer } from "./footer";
export type { FooterProps } from "./footer";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/layout/footer/
git commit -m "feat(design-system): add Footer component"
```

---

### Task 4.4: Create Nav Component

**Files:**
- Create: `packages/design-system/src/components/layout/nav/nav.tsx`
- Create: `packages/design-system/src/components/layout/nav/nav.test.tsx`
- Create: `packages/design-system/src/components/layout/nav/index.ts`

**Step 1: Write failing test**

Create `packages/design-system/src/components/layout/nav/nav.test.tsx`:

```tsx
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { NavLink } from "./nav";

describe("NavLink", () => {
  it("renders nav link with monospace font", async () => {
    const { getByRole } = render(<NavLink href="/about">About</NavLink>);
    const link = getByRole("link");
    await expect.element(link).toHaveClass("font-mono");
  });

  it("renders active state with strong text", async () => {
    const { getByRole } = render(
      <NavLink href="/about" active>
        About
      </NavLink>,
    );
    const link = getByRole("link");
    await expect.element(link).toHaveClass("text-text-strong");
  });

  it("renders inactive state with muted text", async () => {
    const { getByRole } = render(<NavLink href="/about">About</NavLink>);
    const link = getByRole("link");
    await expect.element(link).toHaveClass("text-text-muted");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `moon design-system:test`
Expected: FAIL

**Step 3: Create nav component**

Create `packages/design-system/src/components/layout/nav/nav.tsx`:

```tsx
import type { ComponentProps, ReactElement } from "react";

import { cn } from "@/lib/utils";

type NavLinkProps = ComponentProps<"a"> & {
  active?: boolean;
};

const NavLink = ({ active, children, className, ...props }: NavLinkProps): ReactElement => {
  return (
    <a
      className={cn(
        "font-mono text-sm transition-colors underline-offset-4",
        active
          ? "text-text-strong underline decoration-solid"
          : "text-text-muted hover:text-text hover:underline decoration-dashed",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export { NavLink };
export type { NavLinkProps };
```

**Step 4: Create index export**

Create `packages/design-system/src/components/layout/nav/index.ts`:

```ts
export { NavLink } from "./nav";
export type { NavLinkProps } from "./nav";
```

**Step 5: Run test to verify it passes**

Run: `moon design-system:test`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/design-system/src/components/layout/nav/
git commit -m "feat(design-system): add NavLink component"
```

---

### Task 4.5: Export Layout Components

**Files:**
- Modify: `packages/design-system/src/index.ts`

**Step 1: Add exports**

Update `packages/design-system/src/index.ts`:

```ts
export { Button } from "./components/base/button/button";
export { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/base/card";
export { Input } from "./components/base/input";
export { Link } from "./components/base/link";
export { Container } from "./components/layout/container";
export { Footer } from "./components/layout/footer";
export { Header } from "./components/layout/header";
export { NavLink } from "./components/layout/nav";
export { Code, CodeBlock } from "./components/typography/code";
export { Heading } from "./components/typography/heading";
export { Text } from "./components/typography/text";
```

**Step 2: Verify build and tests**

Run: `moon design-system:build && moon design-system:test`
Expected: PASS

**Step 3: Commit**

```bash
git add packages/design-system/src/index.ts
git commit -m "feat(design-system): export layout components"
```

---

## Phase 5: Blog Implementation

### Task 5.1: Create Blog Layout

**Files:**
- Create: `apps/blog-fe/src/components/layout.tsx`

**Step 1: Create layout component**

Create `apps/blog-fe/src/components/layout.tsx`:

```tsx
import { Container, Footer, Header, NavLink } from "@miniapps/design-system";
import type { ReactElement, ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header logo="terminal.blog">
        <NavLink href="/" active>
          posts
        </NavLink>
        <NavLink href="/about">about</NavLink>
      </Header>
      <main className="flex-1 py-16">
        <Container>{children}</Container>
      </main>
      <Footer>
        <span>2026 · built with terminal aesthetic</span>
      </Footer>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add apps/blog-fe/src/components/layout.tsx
git commit -m "feat(blog-fe): add Layout component"
```

---

### Task 5.2: Create Blog Post List

**Files:**
- Create: `apps/blog-fe/src/components/post-list.tsx`

**Step 1: Create post list component**

Create `apps/blog-fe/src/components/post-list.tsx`:

```tsx
import { Link, Text } from "@miniapps/design-system";
import type { ReactElement } from "react";

type Post = {
  date: string;
  excerpt: string;
  slug: string;
  title: string;
};

type PostListProps = {
  posts: Post[];
};

export const PostList = ({ posts }: PostListProps): ReactElement => {
  return (
    <ul className="space-y-8">
      {posts.map((post) => (
        <li key={post.slug} className="group">
          <div className="flex items-baseline gap-4 mb-1">
            <span className="font-mono text-sm text-text-muted shrink-0">{post.date}</span>
            <Link href={`/posts/${post.slug}`} className="font-mono font-medium">
              {post.title}
            </Link>
          </div>
          <Text size="small" variant="muted" className="pl-[calc(theme(spacing.4)+5ch)]">
            {post.excerpt}
          </Text>
        </li>
      ))}
    </ul>
  );
};
```

**Step 2: Commit**

```bash
git add apps/blog-fe/src/components/post-list.tsx
git commit -m "feat(blog-fe): add PostList component"
```

---

### Task 5.3: Create Blog Post View

**Files:**
- Create: `apps/blog-fe/src/components/post-view.tsx`

**Step 1: Create post view component**

Create `apps/blog-fe/src/components/post-view.tsx`:

```tsx
import { Heading, Text } from "@miniapps/design-system";
import type { ReactElement, ReactNode } from "react";

type PostViewProps = {
  children: ReactNode;
  date: string;
  readingTime: string;
  title: string;
};

export const PostView = ({ children, date, readingTime, title }: PostViewProps): ReactElement => {
  return (
    <article>
      <header className="mb-12">
        <Heading level={1} className="mb-4">
          {title}
        </Heading>
        <div className="flex items-center gap-2 font-mono text-sm text-text-muted">
          <span>{date}</span>
          <span>·</span>
          <span>{readingTime}</span>
        </div>
      </header>
      <div className="prose prose-terminal">{children}</div>
    </article>
  );
};
```

**Step 2: Commit**

```bash
git add apps/blog-fe/src/components/post-view.tsx
git commit -m "feat(blog-fe): add PostView component"
```

---

### Task 5.4: Update App Entry

**Files:**
- Modify: `apps/blog-fe/src/app-entry.tsx`

**Step 1: Replace with blog home page**

Replace `apps/blog-fe/src/app-entry.tsx`:

```tsx
import { Heading } from "@miniapps/design-system";

import { Layout } from "./components/layout";
import { PostList } from "./components/post-list";

const SAMPLE_POSTS = [
  {
    date: "2026-01-17",
    excerpt: "How to build a design system with a terminal aesthetic using React and Tailwind.",
    slug: "building-terminal-design-system",
    title: "Building a Terminal Design System",
  },
  {
    date: "2026-01-15",
    excerpt: "Why monochrome interfaces can improve focus and reduce cognitive load.",
    slug: "case-for-monochrome",
    title: "The Case for Monochrome UI",
  },
  {
    date: "2026-01-10",
    excerpt: "Tips for creating readable long-form content on the web.",
    slug: "typography-for-developers",
    title: "Typography for Developers",
  },
];

export const App: React.FC = () => {
  return (
    <Layout>
      <Heading level={1} className="mb-12">
        posts
      </Heading>
      <PostList posts={SAMPLE_POSTS} />
    </Layout>
  );
};
```

**Step 2: Verify dev server**

Run: `moon :dev`
Expected: Blog renders with terminal styling

**Step 3: Commit**

```bash
git add apps/blog-fe/src/app-entry.tsx
git commit -m "feat(blog-fe): implement blog home page with terminal design"
```

---

### Task 5.5: Final Verification

**Step 1: Run full CI**

Run: `moon ci`
Expected: All checks pass

**Step 2: Create summary commit**

```bash
git add -A
git commit -m "feat: complete terminal design system implementation

- Add neutral grey color tokens with light/dark mode
- Add typography components (Heading, Text, Code, CodeBlock)
- Add base components (Button, Input, Link, Card)
- Add layout components (Container, Header, Footer, NavLink)
- Implement blog with terminal aesthetic

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

| Phase | Tasks | Components |
|-------|-------|------------|
| 1. Foundation | 2 | CSS tokens, fonts |
| 2. Typography | 4 | Heading, Text, Code, CodeBlock |
| 3. Base | 5 | Button, Input, Link, Card |
| 4. Layout | 5 | Container, Header, Footer, NavLink |
| 5. Blog | 5 | Layout, PostList, PostView, App |

**Total: 21 tasks**
