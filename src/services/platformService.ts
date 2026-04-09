import { supabase } from "@/integrations/supabase/client";
import type { Platform, FeatureConfig } from "@/types";

export async function fetchUserPlatforms(userId: string): Promise<Platform[]> {
  const { data } = await supabase
    .from("platforms")
    .select("id, subdomain, monthly_price, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as Platform[]) || [];
}

interface CreatePlatformParams {
  userId: string;
  systemId: string;
  subdomain: string;
  mobileApp: boolean;
  storageGb: number;
  capacityUsers: number;
  monthlyPrice: number;
}

export async function createPlatform(params: CreatePlatformParams) {
  return supabase
    .from("platforms")
    .insert({
      user_id: params.userId,
      system_id: params.systemId,
      subdomain: params.subdomain,
      mobile_app: params.mobileApp,
      storage_gb: params.storageGb,
      capacity_users: params.capacityUsers,
      monthly_price: params.monthlyPrice,
      status: "active",
    })
    .select("id")
    .single();
}

export async function insertPlatformFeatures(platformId: string, features: FeatureConfig[]) {
  return supabase.from("platform_features").insert(
    features.map((f) => ({
      platform_id: platformId,
      feature_slug: f.slug,
      feature_price: f.price,
    }))
  );
}

interface DeployExternalParams {
  apiUrl: string;
  domain: string;
  storage: number;
  capacity: number;
  mobileApp: boolean;
  features: string[];
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function deployToExternalApi(params: DeployExternalParams) {
  return supabase.functions.invoke("create-platform", {
    body: {
      api_url: params.apiUrl,
      domain: params.domain,
      storage: params.storage,
      capacity: params.capacity,
      mobile_app: params.mobileApp,
      features: params.features,
      name: params.name,
      email: params.email,
      phone: params.phone,
      password: params.password,
    },
  });
}
