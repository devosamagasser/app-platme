import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("email, full_name, is_developer, tokens")
    .eq("id", userId)
    .single();
  return data as Profile | null;
}

export async function fetchTokens(userId: string): Promise<number | null> {
  const { data } = await supabase
    .from("profiles")
    .select("tokens")
    .eq("id", userId)
    .single();
  return data?.tokens ?? null;
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, "full_name">>) {
  return supabase.from("profiles").update(updates).eq("id", userId);
}
