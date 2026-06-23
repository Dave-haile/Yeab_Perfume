import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "./AppLayout";
import AdminGuard from "./AdminGuard";

// Lazy load page views for code splitting
const CatalogGrid = lazy(() => import("../views/CatalogGrid"));
const Presenter = lazy(() => import("../views/Presenter"));
const BrandPresenter = lazy(() => import("../views/BrandPresenter"));
const LuxuryPresenter = lazy(() => import("../views/LuxuryPresenter"));
const AdminLogin = lazy(() => import("../pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));

function LoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-24">
      <div className="w-8 h-8 border-2 border-[#c19253] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Admin routes - outside AppLayout (no header/sidebar) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />

        {/* Main app layout with header */}
        <Route element={<AppLayout />}>
          {/* Redirect root to grid view */}
          <Route path="/" element={<Navigate to="/view/grid" replace />} />

          {/* Main views */}
          <Route path="/view/grid" element={<CatalogGrid />} />
          <Route path="/view/presenter" element={<Presenter />} />
          <Route path="/view/brand" element={<BrandPresenter />} />
          <Route path="/view/luxury" element={<LuxuryPresenter />} />

          {/* Old admin route - redirect to new admin login */}
          <Route
            path="/view/admin"
            element={<Navigate to="/admin/login" replace />}
          />

          {/* Fallback: any unknown route redirects to grid */}
          <Route path="*" element={<Navigate to="/view/grid" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
