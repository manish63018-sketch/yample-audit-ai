# 02 — Animation Guidelines & Motion Tokens

Purpose: Define a minimal, performance-conscious motion system for AuditAI so animations feel purposeful, consistent, and respectful of accessibility preferences.

## Principles
- Motion with purpose: every animation must communicate state or direction.
- Subtle and fast: prefer short durations and low displacement.
- Preserve performance: avoid layout-triggering properties; prefer transform + opacity.
- Respect user preferences: honor `prefers-reduced-motion`.

## Motion Tokens

- Eases:
  - `ease-standard`: cubic-bezier(0.2, 0.8, 0.2, 1)
  - `ease-entrance`: cubic-bezier(0.16, 1, 0.3, 1)
  - `ease-exit`: cubic-bezier(0.4, 0, 0.2, 1)

- Durations:
  - `duration-fast`: 150ms
  - `duration-medium`: 200ms
  - `duration-slow`: 250ms

- Motion Scale:
  - `micro`: 4–8px
  - `small`: 8–12px
  - `medium`: 12–24px

## Recommended Properties
- Transform: `translate3d`, `scale`, `rotate` (GPU-accelerated)
- Opacity: for crossfades and soft entrance
- Avoid: `width`, `height`, `top`, `left`, `margin` for animated transitions

## Patterns & Examples

1) Entrance / Exit (cards, dialogs)
- Variant:
  - initial: { opacity: 0, y: 8 }
  - animate: { opacity: 1, y: 0 }
  - exit: { opacity: 0, y: 8 }
- Transition: { duration: duration-medium, ease: ease-entrance }

2) Hover (buttons, rows)
- Use subtle scale and shadow
- Example: scale 1 → 1.02, shadow lift, duration-fast

3) Expand / Collapse (accordions, side panels)
- Animate max-height only when necessary; prefer scaleY + opacity on inner content and handle layout reflow via CSS

4) Progress & Loading
- Prefer determinate progress when available
- Use skeletons with subtle shimmer (linear gradient moved via transform)

5) Motion for Navigation
- Sidebar collapse: animate width from 280px → 80px using CSS transition for layout and fade/scale icons inside for visual continuity

## Framer Motion — Quick Patterns

Entrance variant (React)

```
const entrance = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16,1,0.3,1] } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } }
}

<motion.div variants={entrance} initial="initial" animate="animate" exit="exit">...</motion.div>
```

Hover transition

```
const hover = { scale: 1.02, transition: { duration: 0.15 } }
<motion.button whileHover={hover}>Click</motion.button>
```

Reduced motion

```
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const entrance = prefersReduced ? { opacity: 1, y: 0 } : { initial: { opacity:0, y:8 }, animate: { opacity:1, y:0 } }
```

## Accessibility
- Provide instant state for critical interactions; do not hide essential UI behind long animations.
- Use `prefers-reduced-motion` to disable non-essential motion.
- Ensure motion does not cause seizures or vestibular issues (avoid complex spinning/zooming).

## Performance Tips
- Keep animation layers isolated (composite only properties)
- Batch DOM updates and avoid reflow
- Use `will-change: transform` sparingly and only on elements with long-lived animations

## Deliverables
- Motion tokens exported to design token format (JSON/CSS variables)
- Framer Motion helper components: `AnimateIn`, `HoverScale`, `Collapsed` with reduced-motion support
- Storybook stories demonstrating each pattern across dark/light and reduced-motion
