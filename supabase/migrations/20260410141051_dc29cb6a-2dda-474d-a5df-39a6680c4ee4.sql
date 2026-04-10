
-- Function to auto-verify developer status based on platform count
CREATE OR REPLACE FUNCTION public.check_developer_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  platform_count INTEGER;
  target_user_id UUID;
BEGIN
  -- Determine which user to check
  IF TG_OP = 'DELETE' THEN
    target_user_id := OLD.user_id;
  ELSE
    target_user_id := NEW.user_id;
  END IF;

  -- Count user's platforms
  SELECT COUNT(*) INTO platform_count
  FROM public.platforms
  WHERE user_id = target_user_id;

  -- Auto-verify: 3+ platforms = developer
  UPDATE public.profiles
  SET is_developer = (platform_count >= 3)
  WHERE id = target_user_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Trigger on platforms table
CREATE TRIGGER auto_verify_developer
AFTER INSERT OR DELETE ON public.platforms
FOR EACH ROW
EXECUTE FUNCTION public.check_developer_status();
