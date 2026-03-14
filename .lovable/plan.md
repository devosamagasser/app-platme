

# Plan: Mobile Responsive Overhaul + Composer Tab Layout + Floating Features Button

## Summary
Three main changes: (1) Fix responsive issues across all pages, (2) Redesign the Composer page for mobile with a tab-based layout (Chat / Preview tabs) and a floating action button for the feature catalog, (3) Improve the navbar.

## 1. Composer Mobile Layout — Tab-Based UI

**Current**: Three side-by-side panels (Left Chat, Center Graph, Right Features) — broken on mobile.

**New mobile behavior** (below `md` breakpoint):
- Two tabs at the top: **Chat** and **Preview** (graph canvas)
- Chat tab shows the LeftPanel full-width
- Preview tab shows the CenterPanel full-width  
- **Floating Action Button (FAB)** in bottom-right corner opens the RightPanel as a bottom sheet/overlay showing available features with active count badge
- Desktop remains unchanged (3-panel layout)

```text
┌─────────────────────────┐
│  Header (logo + proceed)│
├──────────┬──────────────┤
│  Chat    │  Preview     │  ← tabs (mobile only)
├──────────┴──────────────┤
│                         │
│   [Active Tab Content]  │
│                         │
│                    [FAB]│  ← floating features button
└─────────────────────────┘
```

**Files to modify:**
- `src/pages/Composer.tsx` — Add mobile tab state, conditionally render panels, add FAB
- `src/components/composer/LeftPanel.tsx` — Remove collapse logic on mobile, render full-width
- `src/components/composer/RightPanel.tsx` — Add overlay/sheet mode for mobile
- `src/components/composer/CenterPanel.tsx` — Ensure touch support for pan/zoom on mobile

## 2. Navbar Improvements

- **LandingNav**: Make logo + text always visible, ensure mobile menu has proper spacing and animation, fix hamburger alignment
- **ComposerHeader**: Tighten spacing on mobile, ensure Proceed button and language switcher don't overflow
- **SelectBusiness nav**: Use the actual logo image (currently uses a CSS placeholder), match style with LandingNav

## 3. General Responsive Fixes

- **Landing page**: Ensure HeroSection text doesn't overflow on small screens, FinalCTA proper padding
- **SelectBusiness**: Reduce padding on mobile (`px-4` instead of `px-8`), ensure cards stack properly
- **Configure page**: Already has `flex-col lg:flex-row` — verify price sidebar stacks correctly on mobile

## Technical Approach

- Use `useIsMobile()` hook (already exists) in Composer for tab detection
- Use shadcn Sheet component for the mobile features overlay (already in project)
- Add touch event handlers to CenterPanel for mobile pan/zoom
- No new dependencies needed

