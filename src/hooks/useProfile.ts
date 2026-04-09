import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchProfile, fetchTokens } from "@/services/profileService";

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  });
}

export function useTokens() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tokens", user?.id],
    queryFn: () => fetchTokens(user!.id),
    enabled: !!user,
  });
}
