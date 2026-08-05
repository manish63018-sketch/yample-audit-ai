# 02 — Responsive Layout & Breakpoints

## Purpose
Define consistent responsive rules so AuditAI components behave predictably across devices and never cause horizontal scrolling or layout shifts.

## Breakpoints
- `mobile` — 0–391px (small phones) — target: 390px
- `tablet` — 392–767px — target: 768px
- `laptop` — 768–1279px — target: 1280px
- `desktop` — 1280–1439px — target: 1440px
- `wide` — 1440px+ — fluid layout with centered content

## Container Widths
- Max page width: 1440px
- Content width: 1280px centered
- Inner content padding: Desktop 32px, Tablet 24px, Mobile 20px

## Grid
- 12-column grid on `laptop` and up
- 8-column grid on `tablet`
- single column flow on `mobile`
- Default gap: 24px; small gap: 16px; tight gap: 8px

## Sidebar Behavior
- Desktop: persistent sidebar (`280px`) left-aligned
- Collapsed: `80px` (icons only)
- Tablet/mobile: sidebar becomes a hidden drawer; open by hamburger

## Navigation
- Top navbar height: 72px desktop, 64px tablet, 56px mobile
- Search collapses into icon on mobile

## Cards & Tables
- Cards stack vertically on mobile
- Tables collapse to responsive rows or use horizontal scroll within a card only if unavoidable; prefer stacked key/value rows on mobile

## Forms & Touch Targets
- Minimum touch target: 44x44px
- Inputs full-width on mobile; grouped horizontally from `tablet` up

## Typography Scaling
- Base font: 16px (mobile), 16px–18px fluid between 768–1440px using clamp()
- Headings scale with viewport using CSS `clamp()` to avoid jumps

## Spacing System
- Tokens: XS 8px, SM 12px, MD 16px, LG 24px, XL 32px, XXL 48px
- Use multiples of 4 for layout rhythm

## Motion & Performance
- Limit animations on mobile; prefer opacity/translate over expensive layout triggers
- Use reduced-motion media query to respect user preferences

## Safe Areas & Overlays
- Account for `env(safe-area-inset-*)` on iOS
- Modals and drawers must be full-height with proper focus trapping

## Accessibility & RTL
- Ensure layouts support RTL (mirrored sidebar, paddings)
- Keyboard focus must not be lost during layout changes (avoid DOM reordering where possible)

## Tailwind / CSS Utility Suggestions
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1440px` (map to AuditAI targets)
- Container utility: centered `max-w-[1280px]` with responsive padding

## Testing Checklist
- No horizontal scrolling on every breakpoint
- Sidebar toggles correctly and focus is managed
- Tables and charts remain legible at small widths
- Touch targets meet minimum size
- Reduced-motion honored
