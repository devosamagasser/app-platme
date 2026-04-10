import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  checkIsAdmin,
  fetchAllProfiles,
  fetchAllPlatforms,
  fetchAllTransactions,
} from "@/services/adminService";

export function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: () => checkIsAdmin(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllProfiles() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: fetchAllProfiles,
    enabled: !!user,
  });
}

export function useAllPlatforms() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admin", "platforms"],
    queryFn: fetchAllPlatforms,
    enabled: !!user,
  });
}

export function useAllTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: fetchAllTransactions,
    enabled: !!user,
  });
}
