# 02 — Component Specifications

Purpose: Provide a canonical set of UI components for AuditAI so engineers and designers make consistent decisions without further design calls.

Principles
- Reusable and composable
- Accessible by default (labels, ARIA, keyboard)
- Dark-first styles
- Variants over overrides
- Prefer composition over duplication

1) Buttons
- Types: `primary`, `secondary`, `ghost`, `danger`, `icon`
- Sizes: `sm` (32px), `md` (40px), `lg` (48px)
- States: `default`, `hover`, `active`, `focus`, `disabled`, `loading`
- Icon placement: `left` or `right` with 8px gap
- Accessibility: `aria-pressed` for toggle, `aria-busy` during loading, labels for icon-only buttons

Design tokens example
- Primary: background `#2563EB`, text `#FAFAFA`, focus ring `2px` of translucent primary

2) Cards
- Usage: grouping related content (metrics, reports, tables)
- Structure: `Card` → optional `CardHeader` (title, subtitle, actions) → `CardBody` → `CardFooter`
- Variants: `elevated` (soft shadow), `flat` (no shadow), `bordered`
- Padding: MD inside cards; compact variant with SM padding

3) Forms & Inputs
- Field types: `text`, `email`, `url`, `number`, `password`, `search`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `date`
- Layout: stacked labels (mobile) and inline pairs (tablet+)
- Labels: required indicator `*`, helper text under input, error text in red and announced to SR via `aria-live="polite"`
- Validation states: neutral, success, error; input borders change color; errors read by SR
- Accessibility: associate `<label for>` with inputs, use `aria-invalid` on errors

4) Forms — Complex Patterns
- Field groups with hint and optional accordion for advanced options
- Async validation flows show inline spinner and message
- File uploader: drag/drop area, progress, preview, remove

5) Tables & Lists
- Use tables for dense tabular data (desktop). On mobile prefer stacked key/value rows.
- Columns: support sorting, resizing, and sticky header
- Pagination: server-driven with page/size and cursor support
- Row actions: overflow menu for edit/download/delete
- Accessibility: `role="table"`, proper `th` scope, skip links for large tables

6) Navigation
- Topbar: contains Logo, global search, notifications, theme toggle, user menu
- Sidebar: collapsible (280px → 80px), grouped sections with separators, keyboard focus for items, keyboard shortcut to toggle

7) Modals & Drawers
- Use drawers for side flows (settings), modals for confirmations/details
- Focus trap, restore focus to trigger on close, close on ESC, `aria-modal="true"`

8) Toasts & Notifications
- Top-right or top-center, limit to 3 visible toasts
- Types: `info`, `success`, `warning`, `error`
- Auto-dismiss configurable (default 6s), pause on hover, accessible role `status` or `alert` depending on severity

9) Skeletons & Loading
- Use skeleton blocks matching the real layout. Prefer shimmer for large content areas and subtle pulse for small elements.

10) Avatars, Badges, Chips
- Avatar sizes: xs 24px, sm 32px, md 40px, lg 56px
- Badges: subtle background, rounded pill, used for status and counts

11) Charts & Visualizations
- Provide dedicated chart container with a caption and accessible summary for screen readers
- Ensure color palette variants accessible for color blindness; use patterns or labels if necessary

12) Utilities
- Spacing tokens (XS, SM, MD, LG, XL), elevation tokens, text utilities (truncate, wrap)

13) Component API Guidelines
- Props: `className`, `style` (avoid inline styles for core visuals), `data-testid` for tests
- Events: `onClick`, `onChange`, `onConfirm`, `onCancel`
- Prefer explicit boolean props over ambiguous enums

14) Code Examples (pseudo)

Button (JSX)

```
<Button variant="primary" size="md" onClick={handle}>Start Audit</Button>
<Button variant="ghost" aria-label="Open settings"><SettingsIcon/></Button>
```

Input (JSX)

```
<Field label="Website URL" name="url" required>
  <Input type="url" placeholder="https://example.com" />
  <FieldHint>Include protocol (https://)</FieldHint>
</Field>
```

Card (JSX)

```
<Card>
  <CardHeader title="Performance" actions={<Button variant="ghost">Details</Button>} />
  <CardBody>...</CardBody>
  <CardFooter>Last scanned: 2 days ago</CardFooter>
</Card>
```

15) Accessibility Notes
- All interactive components must be focusable and keyboard operable.
- Provide skip links and landmark regions on major pages.
- Use `aria-live` for dynamic content updates.

16) Testing & Documentation
- Each component must include a Storybook story with dark/light mode and RTL.
- Provide visual regression tests (Chromatic or Percy) and accessibility checks (axe-core) for each component.

17) Deliverables
- `components/` folder: implement tokens, primitives (Button, Input, Card), composed layouts (AuditCard, ReportTable)
- Storybook configuration and stories for each component
- Documentation in `docs/components.md` (this file)
