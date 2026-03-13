

## Plan: Composer UI Improvements + Backend Feature Registry

### Changes Overview

1. **Remove "Preview" and "System Health" buttons** from `ComposerHeader.tsx`. Keep only Deploy and the telemetry indicators.

2. **Improve chatbot system prompt** — Update `getSystemPrompt()` in `businessFeatures.ts` to instruct Gomaa to respond in the same language the user writes in (Arabic → Arabic, English → English). Also improve the prompt to be more conversational and sales-oriented.

3. **Fix scrollbar color** — Add custom scrollbar styling in `index.css` to match the dark theme (forest green/mint tones instead of default white/grey).

4. **Right Panel → Feature Catalog** — Replace the current "Module Inspector" with a list of all available features for the selected business vertical. Each feature card shows name, description, category, storage, capacity, and config details. When a feature is added to the graph, it gets a visual indicator (checkmark/active state).

5. **Database: Systems & Features tables** — Create two tables:
   - `systems` — id, name, description, icon, active (boolean)
   - `system_features` — id, system_id (FK), name, description, category, dependencies (jsonb), storage, capacity, config (jsonb)
   
   Seed with Education and E-commerce data from `businessFeatures.ts`. No RLS needed (public read-only data).

6. **Edge function update** — Modify `chat/index.ts` to accept `businessType`, fetch the system's features from the database, and build the system prompt dynamically on the backend (not client-side). Add instruction to respond in the user's language.

7. **Frontend data flow** — `Composer.tsx` fetches features from the database for the selected business. Passes them to `RightPanel` (catalog view) and to `LeftPanel` (no more client-side system prompt building — just send businessType to the edge function).

### Files to Create/Modify

**Database migration:**
```sql
CREATE TABLE public.systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.system_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id uuid REFERENCES public.systems(id) ON DELETE CASCADE NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  dependencies jsonb DEFAULT '[]',
  storage text,
  capacity text,
  config jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  UNIQUE(system_id, slug)
);

-- Seed Education system
INSERT INTO public.systems (slug, name, description, icon, active) VALUES
  ('education', 'Education', 'Build complete learning management systems with courses, memberships, and certification.', 'GraduationCap', true),
  ('ecommerce', 'E-Commerce', 'Full-stack commerce infrastructure with inventory, payments, and fulfillment.', 'ShoppingCart', true),
  ('gym', 'Gym & Fitness', 'Gym management systems with member tracking, scheduling, and trainer tools.', 'Dumbbell', false),
  ('clinic', 'Clinic & Healthcare', 'Clinic management with appointments, patient records, and billing.', 'Stethoscope', false),
  ('restaurant', 'Restaurant', 'Restaurant operations with ordering, reservations, and kitchen management.', 'UtensilsCrossed', false);

-- Seed features (Education + E-commerce from businessFeatures.ts)
-- ... all modules from the existing config
```

**Modify:**
- `src/components/composer/ComposerHeader.tsx` — Remove Preview + System Health buttons
- `src/components/composer/RightPanel.tsx` — Show feature catalog instead of module inspector
- `src/components/composer/LeftPanel.tsx` — Send businessType to edge function, remove client-side system prompt
- `src/pages/Composer.tsx` — Fetch features from DB, pass to panels
- `supabase/functions/chat/index.ts` — Accept businessType, fetch features from DB, build prompt server-side, add "respond in user's language" instruction
- `src/index.css` — Custom scrollbar styles
- `src/lib/businessFeatures.ts` — Keep as fallback/types but primary data comes from DB

