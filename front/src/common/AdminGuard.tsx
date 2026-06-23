import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../lib/api";

interface AdminGuardProps {
  children: React.ReactNode;
  requireRole?: "admin" | "staff"; // default: any logged-in user
}

/**
 * AdminGuard — wraps any admin route to ensure:
 * 1. The user is logged in (has a valid token)
 * 2. Optionally, the user has a specific role (e.g. admin-only pages)
 *
 * Usage in your router:
 *
 *   <Route path="/admin" element={
 *     <AdminGuard>
 *       <AdminLayout />
 *     </AdminGuard>
 *   } />
 *
 *   <Route path="/admin/users" element={
 *     <AdminGuard requireRole="admin">
 *       <UsersPage />
 *     </AdminGuard>
 *   } />
 *
 * While checking auth (the /api/auth/me call), renders nothing — no
 * flash of the protected page before the redirect happens.
 */
export default function AdminGuard({ children, requireRole }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  // Role check failed
  if (requireRole === "admin" && user.role !== "admin") return null;

  return <>{children}</>;
}
