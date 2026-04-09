import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserPlatforms } from "@/services/platformService";

export function usePlatforms() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["platforms", user?.id],
    queryFn: () => fetchUserPlatforms(user!.id),
    enabled: !!user,
  });
}
