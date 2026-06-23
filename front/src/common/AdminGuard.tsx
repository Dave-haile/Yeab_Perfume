import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in — redirect to login, remember where they were going
      navigate("/admin/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    if (requireRole === "admin" && user.role !== "admin") {
      // Logged in but wrong role — send to dashboard with an error message
      navigate("/admin", {
        replace: true,
        state: { error: "You need admin access to view that page." },
      });
    }
  }, [user, loading, requireRole, navigate, location]);

  // Don't render anything while checking — prevents a flicker of protected content
  if (loading) return null;

  // Not authed — also render nothing (the useEffect above will redirect)
  if (!user) return null;

  // Role check failed
  if (requireRole === "admin" && user.role !== "admin") return null;

  return <>{children}</>;
}
