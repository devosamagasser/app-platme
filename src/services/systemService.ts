import { supabase } from "@/integrations/supabase/client";
import type { FeatureItem, SystemPricing } from "@/types";

export async function fetchSystemBySlug(slug: string) {
  const { data } = await supabase
    .from("systems")
    .select("id, name, unit_storage_price, unit_capacity_price, mobile_app_price, creation_token_cost, api_url")
    .eq("slug", slug)
    .single();
  return data;
}

export async function fetchSystemFeatures(systemId: string): Promise<FeatureItem[]> {
  const { data } = await supabase
    .from("system_features")
    .select("slug, name, description, name_ar, description_ar, category, is_default, price, active")
    .eq("system_id", systemId);

  if (!data) return [];

  return data.map((f) => ({
    slug: f.slug,
    name: f.name,
    description: f.description,
    name_ar: f.name_ar,
    description_ar: f.description_ar,
    category: f.category,
    is_default: f.is_default ?? false,
    price: Number(f.price) ?? 0,
    active: f.active ?? true,
  }));
}

export async function fetchSystemPricing(slug: string): Promise<{ pricing: SystemPricing; features: FeatureItem[] } | null> {
  const system = await fetchSystemBySlug(slug);
  if (!system) return null;

  const pricing: SystemPricing = {
    id: system.id,
    unit_storage_price: Number(system.unit_storage_price) || 0,
    unit_capacity_price: Number(system.unit_capacity_price) || 0,
    mobile_app_price: Number(system.mobile_app_price) || 0,
    creation_token_cost: Number(system.creation_token_cost) || 1,
    api_url: system.api_url || null,
  };

  return { pricing, features: [] };
}

export async function fetchSelectedFeatures(systemId: string, slugs: string[]) {
  const { data } = await supabase
    .from("system_features")
    .select("slug, name, name_ar, category, price")
    .eq("system_id", systemId)
    .in("slug", slugs);

  if (!data) return [];

  return data.map((f) => ({
    slug: f.slug,
    name: f.name,
    name_ar: f.name_ar,
    category: f.category,
    price: Number(f.price) || 0,
  }));
}
