
ALTER TABLE public.system_features 
  ADD COLUMN icon text,
  ADD COLUMN is_default boolean DEFAULT false,
  ADD COLUMN name_ar text,
  ADD COLUMN description_ar text;
