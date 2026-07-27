# Integration Guide (SEG Design Implementation Package v1.0)

## Package Structure
tokens → theme/direction providers → primitives → patterns → layouts → experience → screens

## Integration Order
1. Merge `styles/tailwind.config.tokens.ts` extend into SEG's tailwind config
2. Add `styles/globals.css` variables
3. Copy `theme/` and wrap app root with ThemeProvider + DirectionProvider
4. Copy `components/primitives` (no dependencies on app code)
5. Copy `components/patterns` (depends only on primitives)
6. Copy `layouts` (depends only on patterns/primitives)
7. Copy `experience/` (isolated, lazy-loaded, no dependencies on screens)
8. Adapt `screens` to real data sources (currently placeholder content)

## Files Copyable As-Is
tokens/*, components/primitives/*, components/utils/cn.ts, experience/*

## Files Requiring Adaptation
screens/* (placeholder data → real data, role context → real auth/session),
layouts/AppShell.tsx (nav items → real routes via next/link + usePathname)

## Known Risks
- Tailwind class name collisions if SEG already defines `seg-*` tokens
- RTL logical properties (`ps-`, `-start-`) require Tailwind logical-properties support (v3.3+)
- NavItem renders a plain `<a>`, not `next/link` — needs adaptation for SPA navigation
- All 8 screens are Client Components due to `next/dynamic({ssr:false})` for HeroAtmosphere
- No routes, package.json, or build config are included in this package by design
