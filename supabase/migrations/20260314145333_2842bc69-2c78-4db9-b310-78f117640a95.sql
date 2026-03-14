ALTER TABLE public.systems
  ADD COLUMN unit_storage_price numeric DEFAULT 0,
  ADD COLUMN unit_capacity_price numeric DEFAULT 0,
  ADD COLUMN mobile_app_price numeric DEFAULT 0;