ALTER TABLE public.systems ADD COLUMN creation_token_cost integer NOT NULL DEFAULT 1;

UPDATE public.systems SET creation_token_cost = 20 WHERE slug = 'education';