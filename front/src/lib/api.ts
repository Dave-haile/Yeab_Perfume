import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Perfume } from "../types";
import { INITIAL_PERFUMES, DEFAULT_ACCORD_COLORS } from "./data";

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "staff";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

// ─── In-memory mock DB (unchanged — used when VITE_API_URL is not set) ───────

let mockPerfumesDb: Perfume[] = [...INITIAL_PERFUMES];
let mockColorsDb: Record<string, string> = { ...DEFAULT_ACCORD_COLORS };
let mockLogoDb: string | null = null;

const MOCK_LATENCY_MS = 300;

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
let _token: string | null = null;

export const tokenStore = {
  get: () => _token,
  set: (t: string) => {
    _token = t;
  },
  clear: () => {
    _token = null;
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
   * Stores the returned token in memory and returns the user object.
   */
  async login(username: string, password: string): Promise<AuthUser> {
    const response = await api.post<{ token: string; user: AuthUser }>(
      "/auth/login",
      { username, password },
    );
    tokenStore.set(response.data.token);
    return response.data.user;
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
    } catch {
      tokenStore.clear();
      return null;
    }
  },

  /** Clears the token from memory. No server call needed. */
  logout() {
    tokenStore.clear();
  },
};

// ─── Perfume service (unchanged logic, now uses authenticated axios) ──────────

export const perfumeService = {
  async fetchAll(): Promise<Perfume[]> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get<{ data: Perfume[] }>("/perfumes");
      return response.data.data;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    return [...mockPerfumesDb];
  },

  async create(perfume: Omit<Perfume, "id">): Promise<Perfume> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post<{ data: Perfume }>("/perfumes", perfume);
      return response.data.data;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    const newPerfume = perfume as Perfume;
    mockPerfumesDb = [newPerfume, ...mockPerfumesDb];
    return newPerfume;
  },

  async update(id: string, perfume: Partial<Perfume>): Promise<Perfume> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.patch<{ data: Perfume }>(
        `/perfumes/${id}`,
        perfume,
      );
      return response.data.data;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    mockPerfumesDb = mockPerfumesDb.map((p) =>
      p.id === id ? { ...p, ...perfume } : p,
    );
    return mockPerfumesDb.find((p) => p.id === id)!;
  },

  async delete(id: string): Promise<void> {
    if (import.meta.env.VITE_API_URL) {
      await api.delete(`/perfumes/${id}`);
      return;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    mockPerfumesDb = mockPerfumesDb.filter((p) => p.id !== id);
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

// ─── Config service (unchanged logic) ────────────────────────────────────────

export const configService = {
  async fetchColors(): Promise<Record<string, string>> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get<Record<string, string>>("/colors");
      return response.data;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    return { ...mockColorsDb };
  },

  async saveColors(
    colors: Record<string, string>,
  ): Promise<Record<string, string>> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post<Record<string, string>>(
        "/colors",
        colors,
      );
      return response.data;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    mockColorsDb = { ...colors };
    return mockColorsDb;
  },

  async fetchLogo(): Promise<string | null> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get<{ logo: string | null }>("/logo");
      return response.data.logo;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    return mockLogoDb;
  },

  async saveLogo(logo: string | null): Promise<string | null> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post<{ logo: string | null }>("/logo", {
        logo,
      });
      return response.data.logo;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    mockLogoDb = logo;
    return logo;
  },
};

// ─── Staff requests service ───────────────────────────────────────────────────

export const staffRequestService = {
  async getAll(includeResolved = false) {
    const response = await api.get(
      `/staff-requests${includeResolved ? "?includeResolved=true" : ""}`,
    );
    return response.data; // { data: StaffRequest[], pendingCount: number }
  },

  async create(perfumeId: string, station?: string) {
    const response = await api.post("/staff-requests", { perfumeId, station });
    return response.data.data;
  },

  async resolve(id: string) {
    const response = await api.patch(`/staff-requests/${id}/resolve`);
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
    const u = await authService.login(username, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}

/**
 * usePerfumes — unchanged API, existing components work without modification.
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
          setPerfumesState(INITIAL_PERFUMES);
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
      mockPerfumesDb = next;
      return next;
    });
  };

  return { perfumes, loading, setPerfumes };
}

/**
 * useAccordColors — unchanged.
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
      .catch(() => {
        if (active) setColorsState(DEFAULT_ACCORD_COLORS);
      });
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
      mockColorsDb = next;
      return next;
    });
  };

  return { colors, setColors };
}

/**
 * useLogo — unchanged.
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
    mockLogoDb = newLogo;
  };

  return { logo, setLogo };
}
