
-- profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  is_developer boolean NOT NULL DEFAULT false,
  tokens integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- platforms table
CREATE TABLE public.platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  system_id uuid NOT NULL REFERENCES public.systems(id),
  subdomain text UNIQUE NOT NULL,
  mobile_app boolean NOT NULL DEFAULT false,
  storage_gb integer NOT NULL DEFAULT 10,
  capacity_users integer NOT NULL DEFAULT 100,
  monthly_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own platforms" ON public.platforms
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own platforms" ON public.platforms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own platforms" ON public.platforms
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- platform_features table
CREATE TABLE public.platform_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id uuid NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  feature_slug text NOT NULL,
  feature_price numeric NOT NULL DEFAULT 0
);
ALTER TABLE public.platform_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own platform features" ON public.platform_features
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.platforms WHERE platforms.id = platform_features.platform_id AND platforms.user_id = auth.uid())
  );
CREATE POLICY "Users insert own platform features" ON public.platform_features
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.platforms WHERE platforms.id = platform_features.platform_id AND platforms.user_id = auth.uid())
  );

-- token_transactions table
CREATE TABLE public.token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own transactions" ON public.token_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tokens)
  VALUES (NEW.id, NEW.email, 50);

  INSERT INTO public.token_transactions (user_id, amount, reason)
  VALUES (NEW.id, 50, 'signup_bonus');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
