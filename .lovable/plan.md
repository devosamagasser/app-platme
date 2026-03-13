

## Plan: Auto-Add Defaults + Complete Flow + Configuration & Pricing Page

### Overview

The user wants a multi-step flow:
1. When chat starts, AI automatically adds all `is_default` features to the workspace (graph)
2. AI then proposes optional features one by one until user says "done"
3. When complete → navigate to a new **Configuration Page** where user sees all selected features and configures: storage, capacity, mobile app (yes/no), and subdomain
4. Pricing is calculated based on storage (per GB), capacity (per user), and mobile app addon

### Changes

#### 1. Auto-add default features on composer load
In `Composer.tsx`, after fetching features from DB, automatically add all `is_default: true` features as nodes to the graph. The AI system prompt is updated to know defaults are already added — it should only propose optional features.

#### 2. Update AI system prompt (edge function)
Modify `chat/index.ts` prompt:
- Tell AI that default features are pre-loaded
- AI should propose optional features one at a time
- When user says "that's it" / "خلاص" / "done", AI should call a new tool `complete_setup` to signal completion
- Add `complete_setup` tool definition alongside `add_module`

#### 3. Add `complete_setup` tool call handling
- New tool in edge function: `complete_setup` (no params)
- In `streamChat.ts`, add `onComplete` callback
- In `LeftPanel.tsx`, handle `onComplete` → triggers navigation to `/configure`
- In `Composer.tsx`, pass `onComplete` handler that navigates to `/configure?business=X`

#### 4. New page: `/configure` (Configuration & Pricing)
**`src/pages/Configure.tsx`** — Shows:
- List of all selected features (passed via state or re-fetched from URL params + localStorage)
- For each feature: storage slider (GB), capacity slider (users)
- Mobile app toggle (adds fixed monthly cost)
- Subdomain input field (e.g., `myschool.platme.com`)
- Live pricing calculator sidebar
- "Confirm & Deploy" button

**Pricing model (display only, no payment integration yet):**
- Per GB storage: configurable base price
- Per user capacity: configurable base price  
- Mobile app addon: fixed monthly fee
- Monthly total displayed

#### 5. Persist selected features
Store selected feature slugs in localStorage when navigating from composer to configure, so the configure page knows which features were chosen.

#### 6. New route
Add `/configure` route in `App.tsx`.

### Files to Create
- `src/pages/Configure.tsx` — Configuration & pricing page

### Files to Modify
- `src/App.tsx` — Add `/configure` route
- `src/pages/Composer.tsx` — Auto-add defaults on load, handle `onComplete`, store selections in localStorage
- `src/components/composer/LeftPanel.tsx` — Add `onComplete` prop/callback
- `src/lib/streamChat.ts` — Add `onComplete` callback, handle `complete_setup` tool call
- `supabase/functions/chat/index.ts` — Update system prompt, add `complete_setup` tool

### Database
No schema changes needed. Feature data already has `is_default`, `storage`, `capacity` columns.

