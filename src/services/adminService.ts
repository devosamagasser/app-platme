import { supabase } from "@/integrations/supabase/client";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  is_developer: boolean;
  tokens: number;
  created_at: string;
}

export interface AdminPlatform {
  id: string;
  subdomain: string;
  monthly_price: number;
  status: string;
  storage_gb: number;
  capacity_users: number;
  mobile_app: boolean;
  created_at: string;
  user_id: string;
}

export interface AdminTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.rpc("has_role" as never, {
    _user_id: userId,
    _role: "admin",
  } as never);
  return !!data;
}

export async function fetchAllProfiles(): Promise<AdminProfile[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_developer, tokens, created_at")
    .order("created_at", { ascending: false });
  return (data as AdminProfile[]) || [];
}

export async function fetchAllPlatforms(): Promise<AdminPlatform[]> {
  const { data } = await supabase
    .from("platforms")
    .select("id, subdomain, monthly_price, status, storage_gb, capacity_users, mobile_app, created_at, user_id")
    .order("created_at", { ascending: false });
  return (data as AdminPlatform[]) || [];
}

export async function fetchAllTransactions(): Promise<AdminTransaction[]> {
  const { data } = await supabase
    .from("token_transactions")
    .select("id, user_id, amount, reason, created_at")
    .order("created_at", { ascending: false });
  return (data as AdminTransaction[]) || [];
}

export async function updatePlatformStatus(platformId: string, status: string) {
  return supabase
    .from("platforms")
    .update({ status })
    .eq("id", platformId);
}
