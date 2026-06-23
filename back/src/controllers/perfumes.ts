import { Request, Response } from "express";
import * as PerfumeModel from "../models/perfumes";

/**
 * Controllers are responsible for three things only:
 * 1. Reading data from the HTTP request (params, body, query)
 * 2. Calling the right model function
 * 3. Sending an HTTP response
 *
 * They never write SQL. They never contain business logic beyond
 * "does this thing exist? if not, 404."
 */

// GET /api/perfumes
// Optional query params: ?gender=Male&category=Luxury+Perfume&inStock=true
export function getAll(req: Request, res: Response) {
  const { gender, category, dayNight, inStock } = req.query;

  const perfumes = PerfumeModel.getAllPerfumes({
    gender: gender as string | undefined,
    category: category as string | undefined,
    dayNight: dayNight as string | undefined,
    inStock:
      inStock === "true" ? true : inStock === "false" ? false : undefined,
  });

  res.json({ data: perfumes, count: perfumes.length });
}

// GET /api/perfumes/:id
export function getOne(req: Request, res: Response) {
  const perfume = PerfumeModel.getPerfumeById(req.params.id as string);

  if (!perfume) {
    res.status(404).json({ error: "Perfume not found" });
    return;
  }

  res.json({ data: perfume });
}

// POST /api/perfumes
export function create(req: Request, res: Response) {
  try {
    const perfume = PerfumeModel.createPerfume(req.body);
    res.status(201).json({ data: perfume });
  } catch (err: any) {
    // SQLite throws when a UNIQUE constraint is violated (e.g. duplicate code)
    if (err.message?.includes("UNIQUE constraint failed")) {
      res
        .status(409)
        .json({ error: "A perfume with that code already exists" });
      return;
    }
    throw err; // let the global error handler deal with anything else
  }
}

// PATCH /api/perfumes/:id
export function update(req: Request, res: Response) {
  try {
    const perfume = PerfumeModel.updatePerfume(
      req.params.id as string,
      req.body,
    );

    if (!perfume) {
      res.status(404).json({ error: "Perfume not found" });
      return;
    }

    res.json({ data: perfume });
  } catch (err: any) {
    if (err.message?.includes("UNIQUE constraint failed")) {
      res
        .status(409)
        .json({ error: "A perfume with that code already exists" });
      return;
    }
    throw err;
  }
}

// DELETE /api/perfumes/:id
export function remove(req: Request, res: Response) {
  const deleted = PerfumeModel.deletePerfume(req.params.id as string);

  if (!deleted) {
    res.status(404).json({ error: "Perfume not found" });
    return;
  }

  res.status(204).send(); // 204 = success, no content to return
}
