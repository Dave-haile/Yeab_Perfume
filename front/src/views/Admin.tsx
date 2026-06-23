import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Legacy Admin page — now redirects to the new /admin/login route.
 * Kept for backward compatibility with any existing links to /view/admin.
 */
export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  return null;
}
