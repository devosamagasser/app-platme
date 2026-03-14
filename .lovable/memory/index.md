# Memory: index.md
Updated: now

PLATME — Guided Intelligence™ design system and project constraints

## Brand
- Deep Forest Green #0f3d2a, Emerald #1d6a45, Mint Accent #9FFFD0
- Dark enterprise interface, glassmorphism, thin borders, mint glow
- Fonts: Satoshi (display/body), IBM Plex Mono (system telemetry)
- No playful UI, no cartoon elements

## Structure
- `/` — Marketing landing page
- `/composer` — Three-panel system composer (left: chat, center: graph, right: inspector)
- `/configure` — System configuration (storage, capacity, mobile, subdomain)
- AI assistant name: Gomaa (جمعة)

## Design Tokens
- All colors defined as HSL in index.css
- Custom tokens: --forest, --forest-deep, --emerald, --mint
- Utility classes: panel-glass, mint-glow, text-gradient-mint, bg-grid, font-mono-system

## i18n
- react-i18next with i18next-browser-languagedetector
- Translation files: src/i18n/en.json, src/i18n/ar.json
- LanguageSwitcher component (dropdown) in nav bars
- Full RTL support for Arabic (dir="rtl" on html)
- Use logical CSS properties (ms-, me-, start, end) instead of left/right
- All UI text must use t() from useTranslation()
