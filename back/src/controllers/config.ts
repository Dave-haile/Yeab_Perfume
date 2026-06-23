import { Request, Response } from "express";
import { getConfig, setConfig } from "../models/config";
import { requireAuth } from "../middleware/auth";

// GET /api/colors — no auth required (public)
export function getColors(_req: Request, res: Response) {
  const raw = getConfig("accord_colors");
  if (!raw) {
    res.json({});
    return;
  }
  try {
    const colors = JSON.parse(raw);
    res.json(colors);
  } catch {
    res.json({});
  }
}

// POST /api/colors — requires auth
export function saveColors(req: Request, res: Response) {
  const colors = req.body; // should be Record<string, string>
  setConfig("accord_colors", JSON.stringify(colors));
  res.json(colors);
}

// GET /api/logo — no auth required (public)
export function getLogo(_req: Request, res: Response) {
  const logo = getConfig("logo");
  res.json({ logo: logo || null });
}

// POST /api/logo — requires auth
export function saveLogo(req: Request, res: Response) {
  const { logo } = req.body;
  setConfig("logo", logo ?? "");
  res.json({ logo: logo ?? null });
}
