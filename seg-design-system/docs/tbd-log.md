# Consolidated TBD Log

## Unresolved

- Breakpoint pixel values
- Arabic font pairing
- Per-screen blueprint detail gaps
- Practice screen: simulator behavior
- Light-mode Primary button contrast: improved (~5.9:1) but original light.primary accent token itself unchanged; residual full-compliance would require darkening the base token, deferred by design
- Duplicated identity/header banner markup across the 6 app screens (not extracted into a shared pattern)
- 3 documentation stubs: accessibility.md, component-guidelines.md, rtl-guidelines.md — headings only, no populated content

## Resolved

- Icon library selection → lucide-react (in package.json, used by Icon primitive)
- Font family/scale → Inter, defined in tokens/typography.ts
- Spacing scale → 11-step scale (0–24), defined in tokens/spacing.ts
- Radius scale → sm/md/lg/xl/full, defined in tokens/radius.ts
- Shadow elevations → sm/md/lg per theme, defined in tokens/shadows.ts
- Motion durations/easing → fast 150ms, base 300ms, slow 400ms, cubic-bezier(0.4,0,0.2,1)
- Dark/light secondary text, border, focus-ring colors → tokens/colors.ts (12 keys per theme)
- AppShell/Sidebar/TopBar composed → integrated via AccountWorkspaceProvider in app/(app)/layout.tsx
