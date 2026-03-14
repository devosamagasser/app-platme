ALTER TABLE public.system_features
  DROP COLUMN IF EXISTS storage,
  DROP COLUMN IF EXISTS capacity,
  DROP COLUMN IF EXISTS config,
  DROP COLUMN IF EXISTS dependencies,
  ADD COLUMN price numeric DEFAULT 0,
  ADD COLUMN active boolean DEFAULT true;