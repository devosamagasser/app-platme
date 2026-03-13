

## Plan: Business Selection Flow + AI-Driven Feature Discovery

### What Changes

1. **Landing Page** — Remove `EducationVertical` section. Update CTAs ("Explore the System", "Request Early Access", Final CTA) to navigate to a new `/select` business selection page.

2. **New Page: `/select` (Business Selection)** — A full-screen page showing available business verticals as selectable cards (Education, E-commerce, Gym, Clinic, Restaurant). Active ones are clickable, inactive ones show "Coming Soon". Selecting a business navigates to `/composer?business=education`.

3. **Composer Update — AI Sales Flow** — Instead of hardcoded chat responses:
   - Read the `business` query param to know which vertical the user selected.
   - Connect to Lovable AI Gateway via a new edge function (`supabase/functions/chat/index.ts`).
   - System prompt per business type defines available features/modules (e.g., for Education: Courses, Membership, Cohorts, Certification, Analytics, Content Delivery, etc.).
   - Gomaa acts as a sales architect — asks the user what they need, proposes features one at a time.
   - When the AI confirms a feature, it uses **tool calling** to return structured output (`add_module` tool) with module name, category, and dependencies.
   - Frontend parses the tool call response and adds the module to the architecture graph in real-time.
   - Graph starts empty — modules appear only as the AI conversation progresses.

4. **Routing** — Add `/select` route in `App.tsx`.

### Technical Details

- **Edge Function**: `supabase/functions/chat/index.ts` — streams responses from Lovable AI Gateway. System prompt varies by business type, includes a `add_module` tool definition so the AI can emit structured module additions.
- **Business feature maps**: Defined in a config file (`src/lib/businessFeatures.ts`) — maps each business type to its available modules with descriptions, so the system prompt can reference them.
- **Streaming + Tool Calls**: Frontend uses SSE streaming. When a tool call (`add_module`) is detected in the stream, it triggers `onAddModule` callback that adds the node/edges to the graph state.
- **LeftPanel refactor**: Replace hardcoded responses with real AI streaming. Keep suggestion chips but make them business-specific.
- **CenterPanel**: Starts with empty graph. Nodes are added dynamically as AI confirms features.

### Files to Create
- `src/pages/SelectBusiness.tsx` — Business selection page
- `src/lib/businessFeatures.ts` — Feature maps per vertical
- `supabase/functions/chat/index.ts` — AI edge function

### Files to Modify
- `src/App.tsx` — Add `/select` route
- `src/pages/Landing.tsx` — Remove EducationVertical import
- `src/components/landing/HeroSection.tsx` — CTA links to `/select`
- `src/components/landing/FinalCTA.tsx` — CTA links to `/select`
- `src/components/landing/LandingNav.tsx` — Remove Education nav link, update "Launch Composer" to go to `/select`
- `src/pages/Composer.tsx` — Read business query param, start with empty graph, wire up AI streaming
- `src/components/composer/LeftPanel.tsx` — Replace mock responses with AI streaming, business-specific suggestions
- `src/components/composer/ComposerHeader.tsx` — Show selected business name

