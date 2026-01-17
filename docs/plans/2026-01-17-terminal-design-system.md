# Terminal Design System

A minimal grey terminal-style design system for use across blog, landing pages, and cloud applications.

## Design Decisions

- **Aesthetic**: Modern minimal - clean grey palette with subtle terminal hints
- **Color**: Neutral grey (no undertones), pure monochrome (no accent colors)
- **Typography**: Mixed - monospace for headings/code, sans-serif for body
- **Terminal hints**: Prompt-style prefixes (`>`), cursor blink on focus, command-line navigation
- **Components**: Full application kit
- **Blog layout**: Single column centered, max-width 65ch

---

## Color System

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `#fafafa` | `#0a0a0a` | Page background |
| `surface` | `#f0f0f0` | `#141414` | Cards, containers |
| `surface-raised` | `#e5e5e5` | `#1f1f1f` | Elevated elements, hover states |
| `border` | `#d4d4d4` | `#262626` | Dividers, outlines |
| `border-strong` | `#a3a3a3` | `#404040` | Focus rings, emphasis |
| `text-muted` | `#737373` | `#737373` | Secondary text, placeholders |
| `text` | `#171717` | `#e5e5e5` | Primary text |
| `text-strong` | `#000000` | `#ffffff` | Headings, emphasis |

### Interactive States

No color changes. Hierarchy through:
- Underline for links (dashed default, solid on hover)
- Background shift to `surface-raised` for buttons/cards on hover
- `border-strong` for focus rings

---

## Typography

### Font Stack

- **Headings & code**: JetBrains Mono (free, excellent readability, ligatures)
- **Body text**: Inter (clean, highly legible, variable font)
- **Fallbacks**: System monospace / system sans-serif

### Scale

| Token | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `h1` | 2rem (32px) | 600 | Mono | Page titles |
| `h2` | 1.5rem (24px) | 600 | Mono | Section headings |
| `h3` | 1.25rem (20px) | 500 | Mono | Subsections |
| `h4` | 1rem (16px) | 500 | Mono | Card titles |
| `body` | 1rem (16px) | 400 | Sans | Paragraphs |
| `body-small` | 0.875rem (14px) | 400 | Sans | Captions, metadata |
| `code` | 0.875rem (14px) | 400 | Mono | Inline code |
| `code-block` | 0.875rem (14px) | 400 | Mono | Code blocks |

### Terminal Hints

- Headings prefixed with `> ` in muted color
- Optional cursor blink (`▌`) on focused inputs
- Line height: 1.6 for body, 1.3 for headings

---

## Components

### Base Components

**Button**
- Variants: `primary` (white bg, black text), `secondary` (transparent, border), `ghost` (no border, underline on hover)
- Sizes: `sm` (28px), `md` (36px), `lg` (44px)
- Monospace font, uppercase optional for primary actions
- Focus: `border-strong` ring, no color shift

**Link**
- Default: underline dashed, `text` color
- Hover: underline solid
- No color change - relies on underline pattern

**Input / Textarea**
- `surface` background, `border` outline
- Focus: `border-strong` + subtle `surface-raised` background
- Placeholder in `text-muted`
- Optional blinking cursor indicator on focus

**Card**
- `surface` background, `border` outline
- Hover: shift to `surface-raised`
- No shadows - flat, terminal-like

**Code Block**
- `surface` background
- Top bar with filename in `text-muted` and copy button
- Syntax highlighting in greys only (comments muted, strings/keywords use weight)

### Application Components

**Modal / Dialog**
- Centered, `surface` background, `border` outline
- Backdrop: semi-transparent black (`rgba(0,0,0,0.6)`)
- Close button: `×` in top right, ghost style
- Title in monospace with `> ` prefix

**Dropdown / Select**
- Trigger styled like Input
- Menu: `surface` background, `border` outline
- Items: `surface-raised` on hover, checkmark for selected
- Monospace for option labels

**Tabs**
- Monospace labels, `text-muted` default
- Active: `text-strong` + bottom border solid
- Hover: `text` color
- No background changes

**Toast / Notification**
- Bottom-right positioned
- `surface-raised` background, `border` outline
- Left border thicker (`4px`) in `text-muted` for subtle emphasis
- Dismiss with `×` button

**Table**
- Minimal borders - only horizontal dividers
- Header: `text-muted`, uppercase, smaller size
- Rows: alternating `background` / `surface` for scanning
- Monospace for data columns (numbers, IDs, dates)

**Checkbox / Radio**
- Custom styled with `border`, filled with `text-strong` when checked
- Checkmark / dot in contrasting color

### Navigation

- Horizontal list, monospace
- Current page: `text-strong` + solid underline
- Others: `text-muted`, underline on hover
- Mobile: vertical stack, same styling

---

## Blog Layout

```
┌─────────────────────────────────────┐
│  > blog.name                   nav  │  Header: logo left, nav right
├─────────────────────────────────────┤
│                                     │
│         ┌───────────────┐           │
│         │   content     │           │  Centered column, max-width 65ch
│         │   max 65ch    │           │
│         └───────────────┘           │
│                                     │
├─────────────────────────────────────┤
│  footer: links · copyright          │  Minimal footer
└─────────────────────────────────────┘
```

### Blog Post Page

- Title: `h1` with `> ` prefix
- Metadata line: date · reading time · tags (all `text-muted`, monospace)
- Content: prose with comfortable spacing
- Code blocks: full-width within content column
- Bottom: previous/next navigation

### Blog Listing Page

- Simple vertical list of posts
- Each entry: title (link) + date + excerpt
- No cards, no images - pure text like `ls -la` output
- Optional: prefix each with `drwx` style decoration

### Spacing

- Section gaps: `4rem`
- Paragraph gaps: `1.5rem`
- Mobile padding: `1rem` sides

---

## Implementation

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-background: #fafafa;
  --color-surface: #f0f0f0;
  --color-surface-raised: #e5e5e5;
  --color-border: #d4d4d4;
  --color-border-strong: #a3a3a3;
  --color-text-muted: #737373;
  --color-text: #171717;
  --color-text-strong: #000000;

  /* Typography */
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-sans: 'Inter', ui-sans-serif, sans-serif;

  /* Spacing */
  --space-section: 4rem;
  --space-block: 1.5rem;

  /* Radius - minimal for terminal feel */
  --radius-sm: 2px;
  --radius-md: 4px;
}

.dark {
  --color-background: #0a0a0a;
  --color-surface: #141414;
  --color-surface-raised: #1f1f1f;
  --color-border: #262626;
  --color-border-strong: #404040;
  --color-text-muted: #737373;
  --color-text: #e5e5e5;
  --color-text-strong: #ffffff;
}
```

### File Structure

```
packages/design-system/src/
  assets/
    tailwind.css        # Token definitions
    fonts/              # JetBrains Mono, Inter
  components/
    base/               # Button, Input, Link, Card, Checkbox, Radio
    composite/          # Modal, Dropdown, Tabs, Toast, Table
    layout/             # Container, Header, Footer, Navigation
    typography/         # Heading, Text, Code, CodeBlock
```

### Tailwind Integration

- Extend theme with grey scale tokens
- Custom utilities for terminal hints (`.prompt-prefix`, `.cursor-blink`)
- Prose styling for blog content via typography components
