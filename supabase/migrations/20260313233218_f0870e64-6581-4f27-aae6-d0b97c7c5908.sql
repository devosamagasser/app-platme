
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

ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access on systems" ON public.systems FOR SELECT USING (true);
CREATE POLICY "Public read access on system_features" ON public.system_features FOR SELECT USING (true);
