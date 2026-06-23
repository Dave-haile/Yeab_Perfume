import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the full URL for an image path.
 *
 * If `path` starts with "/uploads/" it prepends the backend origin
 * (derived from VITE_API_URL) so the browser can reach the backend's
 * static file server.  Otherwise it assumes the path is already
 * an absolute URL and returns it as-is.
 */
export function imageUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (path.startsWith("/uploads/")) {
    // VITE_API_URL = http://localhost:8000/api  →  base = http://localhost:8000
    const api = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const base = api.replace(/\/api\/?$/, "");
    return `${base}${path}`;
  }
  return path;
}
