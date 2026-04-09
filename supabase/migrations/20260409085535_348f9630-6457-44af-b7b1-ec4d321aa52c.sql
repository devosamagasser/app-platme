-- 1. Fix profiles UPDATE policy - restrict to safe columns only
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND is_developer = (SELECT p.is_developer FROM public.profiles p WHERE p.id = auth.uid())
  AND tokens = (SELECT p.tokens FROM public.profiles p WHERE p.id = auth.uid())
);

-- 2. Add UPDATE and DELETE policies for platform_features
CREATE POLICY "Users update own platform features"
ON public.platform_features
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM platforms
  WHERE platforms.id = platform_features.platform_id
  AND platforms.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM platforms
  WHERE platforms.id = platform_features.platform_id
  AND platforms.user_id = auth.uid()
));

CREATE POLICY "Users delete own platform features"
ON public.platform_features
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM platforms
  WHERE platforms.id = platform_features.platform_id
  AND platforms.user_id = auth.uid()
));

-- 3. Add DELETE policy for platforms
CREATE POLICY "Users delete own platforms"
ON public.platforms
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);