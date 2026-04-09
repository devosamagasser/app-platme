import { useQuery } from "@tanstack/react-query";
import { fetchSystemBySlug, fetchSystemFeatures } from "@/services/systemService";
import type { FeatureItem, SystemPricing } from "@/types";

export function useSystemFeatures(businessType: string) {
  return useQuery({
    queryKey: ["system-features", businessType],
    queryFn: async (): Promise<{ features: FeatureItem[]; pricing: SystemPricing | null }> => {
      const system = await fetchSystemBySlug(businessType);
      if (!system) return { features: [], pricing: null };

      const features = await fetchSystemFeatures(system.id);

      const pricing: SystemPricing = {
        id: system.id,
        unit_storage_price: Number(system.unit_storage_price) || 0,
        unit_capacity_price: Number(system.unit_capacity_price) || 0,
        mobile_app_price: Number(system.mobile_app_price) || 0,
        creation_token_cost: Number(system.creation_token_cost) || 1,
        api_url: system.api_url || null,
      };

      return { features, pricing };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
