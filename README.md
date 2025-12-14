# Compass Motion Design Lab

Recreation of the Compass primary button, checkbox, and carousel card with Motion-powered hover/press micro-interactions. Built with React + Vite + Motion.

## Quick start
- Use Node 20.19.6+ (Vite 7 requires Node 20+).
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`

## Deploy to GitHub Pages
1) Ensure `vite.config.ts` has `base: "/Motion/"` (or your repo name).  
2) Deploy: `GH_TOKEN=YOUR_PAT npm run deploy -- --repo https://github.com/munan-w/Motion.git`  
3) In GitHub Pages, set source: branch `gh-pages`, folder `/root`.  
Site: `https://munan-w.github.io/Motion/`.

## Components
- **Button** (`src/components/Button.tsx`): Props mirror Figma variants (Primary/Secondary/Tertiary/Neutral/Dark), states (Rest/Hover/Pressed/Focus/Loading/Disabled), `onColor`, `iconOnly`, `leftIcon`, `dropdown`, `noPadding`, `pressScale`. Motion `press` helper applied.
- **Checkbox** (`src/components/Checkbox.tsx`): Animated check/indeterminate paths via `AnimatePresence`, hover/focus ring per spec, controlled/uncontrolled.
- **Carousel** (`src/components/Carousel.tsx`): Motion hover/press on cards, focusable, auto-selects centered card on scroll, buttons with press motion.

## Motion tokens
- Press spring: stiffness 1000, damping 50, scale 0.8→1
- Durations: buttons/checkbox 0.10s; cards 0.20s
- Easing: easeInOut cubic-bezier(0.4, 0, 0.2, 1)
- Hover/tap: cards 1.02 / 0.98
