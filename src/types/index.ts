// ==========================================
// Shared Types for PLATME
// ==========================================

// --- Graph Types (System Studio) ---
export interface GraphNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  status: "active" | "proposed";
}

export interface GraphEdge {
  from: string;
  to: string;
}

// --- Feature Types ---
export interface FeatureItem {
  slug: string;
  name: string;
  description: string;
  name_ar: string | null;
  description_ar: string | null;
  category: string;
  is_default: boolean | null;
  price: number;
  active: boolean;
}

export interface FeatureConfig {
  slug: string;
  name: string;
  name_ar: string | null;
  category: string;
  price: number;
}

// --- Platform & Profile ---
export interface Platform {
  id: string;
  subdomain: string;
  monthly_price: number;
  status: string;
  created_at: string;
}

export interface Profile {
  email: string;
  full_name: string | null;
  is_developer: boolean;
  tokens: number;
}

export interface SystemPricing {
  id: string;
  unit_storage_price: number;
  unit_capacity_price: number;
  mobile_app_price: number;
  creation_token_cost: number;
  api_url: string | null;
}

// --- Chat ---
export type { ChatMessage, AddModuleCall } from "@/lib/streamChat";
