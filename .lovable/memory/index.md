PLATME — Guided Intelligence™ design system and project constraints

## Brand
- Deep Forest Green #0f3d2a, Emerald #1d6a45, Mint Accent #9FFFD0
- Dark enterprise interface, glassmorphism, thin borders, mint glow
- Fonts: Satoshi (display/body), IBM Plex Mono (system telemetry)
- No playful UI, no cartoon elements

## Structure
- `/` — Marketing landing page (general, no specific vertical)
- `/select` — Business vertical selection page
- `/composer?business=<type>` — Three-panel system composer (left: AI chat, center: graph, right: inspector)
- AI assistant name: Gomaa (جمعة) — acts as sales architect per vertical
- AI powered by Lovable AI Gateway via edge function `chat`

## Design Tokens
- All colors defined as HSL in index.css
- Custom tokens: --forest, --forest-deep, --emerald, --mint
- Utility classes: panel-glass, mint-glow, text-gradient-mint, bg-grid, font-mono-system

## Architecture
- Business verticals defined in src/lib/businessFeatures.ts
- AI streaming with tool calling (add_module) in src/lib/streamChat.ts
- Modules added dynamically to graph via AI confirmation
- EducationVertical section removed from landing (keep it general)
