# 02 — Accessibility Checklist & Keyboard Patterns

Purpose: Ensure AuditAI meets WCAG AA and provides accessible, keyboard-first experiences across the product.

## Principles
- Keyboard-first: all functionality accessible via keyboard
- Semantic HTML: use landmarks and correct elements
- Announcements: use `aria-live` for dynamic updates
- Contrast & focus: meet color contrast and visible focus indicators
- Respect preferences: `prefers-reduced-motion`

## WCAG Targets
- Aim: WCAG 2.1 AA (minimum); prefer WCAG 2.2 where applicable
- Color contrast: text ratio ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- Focus indicator: 3px minimum visible outline or ring

## Keyboard Patterns
- Global shortcuts: document and provide a keyboard menu (e.g., `/` to focus search)
- Focus order: logical DOM order; avoid unexpected reordering
- Modal & Drawer: trap focus inside, return focus to trigger on close
- Skip links: `Skip to content` for screen reader and keyboard users
- Table keyboarding: arrow keys navigate cells, Enter opens row actions

## ARIA & Semantic
- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- Use `role` only when necessary; prefer native elements
- `aria-live="polite"` for non-critical updates, `aria-live="assertive"` for urgent alerts
- Announce status changes (audit progress) using SR-only text and `aria-live`

## Forms
- Labels always associated (`<label for>`)
- Use `aria-describedby` for helper/error text
- Real-time validation: announce errors via `aria-live` and move focus to first invalid field on submit

## Components (Rules)
- Buttons: keyboard focusable, `:focus` visible, `aria-pressed` for toggles
- Links: use anchor elements for navigation
- Dropdowns: `aria-expanded`, `aria-controls`, keyboard navigation with Arrow keys
- Tabs: `role="tablist"`, `role="tab"`, `aria-selected` and Arrow navigation

## Visual Design
- Ensure contrast for all text, icons, and UI controls
- Focus ring color should be visible against backgrounds

## Motion & Vestibular
- Respect `prefers-reduced-motion` and provide non-animated alternatives

## Testing & Tooling
- Automated: `axe-core`, `eslint-plugin-jsx-a11y`, Lighthouse accessibility
- Manual: keyboard-only navigation, screen reader walkthrough (NVDA/VoiceOver), color contrast tools
- Include accessibility tests in CI with a fail-on-critical-violations policy

## Documentation
- Each component story must include an accessibility section describing ARIA attributes, keyboard behavior, and known limitations.

## Quick Checklist (for PRs)
- [ ] Keyboard accessible
- [ ] Screen reader announcements added for dynamic content
- [ ] Focus states visible and logical
- [ ] Contrast meets targets
- [ ] Reduced-motion supported
- [ ] Automated a11y checks pass
