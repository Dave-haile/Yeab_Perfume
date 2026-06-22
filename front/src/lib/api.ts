import { useState, useEffect } from "react";
import axios from "axios";
import { Perfume } from "../types";
import { INITIAL_PERFUMES, DEFAULT_ACCORD_COLORS } from "./data";

// Simulated in-memory database representing the server's backend storage.
// Since local storage is removed, this acts as the dynamic cloud data-store.
let mockPerfumesDb: Perfume[] = [...INITIAL_PERFUMES];
let mockColorsDb: Record<string, string> = { ...DEFAULT_ACCORD_COLORS };
let mockLogoDb: string | null = null;

/**
 * Production-ready Axios instance configured with defaults.
 * The basePath defaults to '/api' but can be overridden by a VITE_API_URL environment variable.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const MOCK_LATENCY_MS = 300;

/**
 * Service handlers for handling scent details and classifications on the server.
 * This structure serves both local offline flow and live REST integrations if VITE_API_URL is supplied.
 */
export const perfumeService = {
  async fetchAll(): Promise<Perfume[]> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get<Perfume[]>("/perfumes");
      return response.data;
    }
    // Simulate API delay & return full database clone
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    return [...mockPerfumesDb];
  },

  async create(perfume: Perfume): Promise<Perfume> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post<Perfume>("/perfumes", perfume);
      return response.data;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    mockPerfumesDb = [perfume, ...mockPerfumesDb];
    return perfume;
  },

  async update(id: string, perfume: Perfume): Promise<Perfume> {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.put<Perfume>(`/perfumes/${id}`, perfume);
      return response.data;
    }
    await new Promise((r) => setTimeout(r, MOCK_LATENCY_MS));
    mockPerfumesDb = mockPerfumesDb.map((p) => (p.id === id ? perfume : p));
    return perfume;
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

/**
 * React Hook that manages active lists of perfumes and handles background sync.
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
      // Propagate state update back into in-memory mock repository asynchronously
      mockPerfumesDb = next;
      return next;
    });
  };

  return { perfumes, loading, setPerfumes };
}

/**
 * React Hook that manages visual accord colors.
 */
export function useAccordColors() {
  const [colors, setColorsState] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    configService
      .fetchColors()
      .then((data) => {
        if (active) {
          setColorsState(data);
        }
      })
      .catch(() => {
        if (active) {
          setColorsState(DEFAULT_ACCORD_COLORS);
        }
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
 * React Hook that manages custom agency/brand branding logos.
 */
export function useLogo() {
  const [logo, setLogoState] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    configService
      .fetchLogo()
      .then((data) => {
        if (active) {
          setLogoState(data);
        }
      })
      .catch(() => {
        // No-op or fallback
      });
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
