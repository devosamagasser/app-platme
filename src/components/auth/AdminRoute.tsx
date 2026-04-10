import { Navigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/PageLoader";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  if (authLoading || adminLoading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AdminRoute;
