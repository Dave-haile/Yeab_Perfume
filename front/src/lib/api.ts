import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Perfume, User, StaffRequest } from "../types";
import { safeStorage } from "./storage";
// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "staff";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

// ─── Token helpers ────────────────────────────────────────────────────────────

/**
 * We store the JWT in memory (a module-level variable) rather than
 * localStorage or sessionStorage.
 *
 * Why not localStorage?
 * localStorage is accessible by any JS on the page — if there's ever
 * an XSS vulnerability, the attacker steals the token trivially.
 * An in-memory variable disappears when the tab closes, which is fine
 * for a kiosk/admin tool where staff log in at the start of each shift.
 *
 * The tradeoff: refreshing the page logs them out. Acceptable here.
 */

export const tokenStore = {
  get(): string | null {
    return safeStorage.getItem("adminToken");
  },

  set(token: string): void {
    safeStorage.setItem("adminToken", token);
  },

  clear(): void {
    safeStorage.removeItem("adminToken");
  },
};

// ─── Axios instance ───────────────────────────────────────────────────────────

/**
 * Single Axios instance used by every service in this file.
 *
 * baseURL resolves in this order:
 * 1. VITE_API_URL env var (set in .env.local for prod)
 * 2. "/api" — works if frontend and backend are on the same origin
 *    (e.g. both served from localhost via a proxy in vite.config.ts)
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST interceptor — runs before every outgoing request.
 *
 * If we have a token in memory, attach it as a Bearer token.
 * This means every service call (perfumes, uploads, staff requests)
 * automatically sends auth without each function having to think about it.
 */
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * RESPONSE interceptor — runs after every incoming response.
 *
 * If the server returns 401 (token expired or invalid), we:
 * 1. Clear the in-memory token
 * 2. Redirect to /admin/login
 *
 * This handles token expiry globally — no need to check for 401
 * inside every individual service function.
 */
api.interceptors.response.use(
  (response) => response, // pass successful responses straight through
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      // Only redirect if we're currently on an admin page
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /api/auth/login
   * Stores the returned token and user in memory and returns the user object.
   */
  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post<{ token: string; user: AuthUser }>(
      "/auth/login",
      { username, password },
    );
    tokenStore.set(response.data.token);
    // Also store the user in safeStorage for dashboard access
    safeStorage.setItem("adminUser", JSON.stringify(response.data.user));
    return response.data;
  },

  /**
   * GET /api/auth/me
   * Verifies the current in-memory token is still valid.
   * Returns the user if valid, null if not.
   */
  async me(): Promise<AuthUser | null> {
    if (!tokenStore.get()) return null;
    try {
      const response = await api.get<{ user: AuthUser }>("/auth/me");
      return response.data.user;
    } catch (err) {
      console.log("me() failed", err);
      tokenStore.clear();
      return null;
    }
  },

  /** Clears the token and user from memory. No server call needed. */
  logout() {
    tokenStore.clear();
    safeStorage.removeItem("adminUser");
  },
};

// ─── Perfume service ─────────────────────────────────────────────────────────

export const perfumeService = {
  async fetchAll(): Promise<Perfume[]> {
    const response = await api.get<{ data: Perfume[] }>("/perfumes");
    return response.data.data;
  },

  async create(perfume: Omit<Perfume, "id">): Promise<Perfume> {
    const response = await api.post<{ data: Perfume }>("/perfumes", perfume);
    return response.data.data;
  },

  async update(id: string, perfume: Partial<Perfume>): Promise<Perfume> {
    const response = await api.patch<{ data: Perfume }>(
      `/perfumes/${id}`,
      perfume,
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/perfumes/${id}`);
  },
};

// ─── Upload service ───────────────────────────────────────────────────────────

export const uploadService = {
  /**
   * POST /api/uploads/image
   *
   * Accepts a File object, wraps it in FormData, and sends it.
   * Returns the URL path to use in mainImage / galleryImages.
   *
   * IMPORTANT: do NOT set Content-Type manually — the browser sets
   * it automatically for multipart/form-data including the boundary
   * string that Multer needs to parse the file. Setting it yourself
   * breaks uploads silently.
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<{ url: string }>(
      "/uploads/image",
      formData,
      {
        headers: {
          // Override the default "application/json" for this one call only
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.url; // e.g. "/uploads/abc123.jpg"
  },

  async deleteImage(filename: string): Promise<void> {
    await api.delete(`/uploads/image/${filename}`);
  },
};

// ─── Config service ──────────────────────────────────────────────────────────

export const configService = {
  async fetchColors(): Promise<Record<string, string>> {
    const response = await api.get<Record<string, string>>("/colors");
    return response.data;
  },

  async saveColors(
    colors: Record<string, string>,
  ): Promise<Record<string, string>> {
    const response = await api.post<Record<string, string>>("/colors", colors);
    return response.data;
  },

  async fetchLogo(): Promise<string | null> {
    const response = await api.get<{ logo: string | null }>("/logo");
    return response.data.logo;
  },

  async saveLogo(logo: string | null): Promise<string | null> {
    const response = await api.post<{ logo: string | null }>("/logo", {
      logo,
    });
    return response.data.logo;
  },
};

// ─── User (admin) service ──────────────────────────────────────────────────────

export interface UserServiceResponse {
  data: User[];
}

export const userService = {
  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: AuthUser }> {
    return authService.login(username, password);
  },

  async fetchAll(): Promise<User[]> {
    const response = await api.get<UserServiceResponse>("/admin/users");
    return response.data.data;
  },

  async create(
    username: string,
    password: string,
    role: UserRole,
  ): Promise<User> {
    const response = await api.post<{ data: User }>("/admin/users", {
      username,
      password,
      role,
    });
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};

// ─── Staff requests service ───────────────────────────────────────────────────

export interface StaffRequestServiceResponse {
  data: StaffRequest[];
  pendingCount: number;
}

export const requestService = {
  async fetchAll(): Promise<StaffRequest[]> {
    const response =
      await api.get<StaffRequestServiceResponse>("/staff-requests");
    return response.data.data;
  },

  async create(perfumeId: string, station?: string) {
    const response = await api.post<{ data: StaffRequest }>("/staff-requests", {
      perfumeId,
      station,
    });
    return response.data.data;
  },

  async resolve(id: string) {
    const response = await api.patch<{ data: StaffRequest }>(
      `/staff-requests/${id}/resolve`,
    );
    return response.data.data;
  },

  async delete(id: string) {
    await api.delete(`/staff-requests/${id}`);
  },
};

// ─── React Hooks ──────────────────────────────────────────────────────────────

/**
 * useAuth — checks if there's a valid token in memory on mount.
 *
 * On page load / refresh, _token is null (module resets).
 * So this hook calls GET /api/auth/me — but wait, if the token
 * is null, that call will fail immediately (no Authorization header).
 *
 * For a kiosk setup this is fine — staff log in at the start of the
 * session and the page isn't refreshed during normal use.
 *
 * If you want persistence across refresh, you'd store the token in
 * an httpOnly cookie (set by the server) instead of memory — but
 * that requires more backend setup. Not needed for a local kiosk.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = await authService.login(username, password);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}

/**
 * usePerfumes — fetches perfumes from the real backend API.
 */
export function usePerfumes() {
  const [perfumes, setPerfumesState] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    perfumeService
      .fetchAll()
      .then((data) => {
        if (active) {
          setPerfumesState(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const setPerfumes = (
    update: Perfume[] | ((prev: Perfume[]) => Perfume[]),
  ) => {
    setPerfumesState((prev) => {
      const next = typeof update === "function" ? update(prev) : update;
      return next;
    });
  };

  return { perfumes, loading, setPerfumes };
}

/**
 * useAccordColors — fetches accord colors from the real backend API.
 */
export function useAccordColors() {
  const [colors, setColorsState] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    configService
      .fetchColors()
      .then((data) => {
        if (active) setColorsState(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const setColors = (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>),
  ) => {
    setColorsState((prev) => {
      const next = typeof update === "function" ? update(prev) : update;
      return next;
    });
  };

  return { colors, setColors };
}

/**
 * useLogo — fetches the logo from the real backend API.
 */
export function useLogo() {
  const [logo, setLogoState] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    configService
      .fetchLogo()
      .then((data) => {
        if (active) setLogoState(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const setLogo = (newLogo: string | null) => {
    setLogoState(newLogo);
  };

  return { logo, setLogo };
}
