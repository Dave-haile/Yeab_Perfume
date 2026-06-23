import { Request, Response } from "express";
import * as StaffRequestModel from "../models/staffRequests";
import { getPerfumeById } from "../models/perfumes";

/**
 * GET /api/staff-requests
 *
 * Query params:
 *   ?includeResolved=true  → return all requests (history)
 *   (no param)             → return only pending requests
 *
 * Also returns a pendingCount for dashboard badge/notification.
 */
export function getAll(req: Request, res: Response) {
  const includeResolved = req.query.includeResolved === "true";
  const requests = StaffRequestModel.getAllRequests({ includeResolved });
  const pendingCount = StaffRequestModel.getPendingCount();

  res.json({ data: requests, pendingCount });
}

/**
 * POST /api/staff-requests
 *
 * Body: { perfumeId: string, station?: string }
 *
 * station is optional — it identifies which kiosk/device made the request
 * (e.g. "iPad 1", "Counter Display"). Useful if you have multiple devices.
 *
 * We look up the perfume name ourselves from the DB so the client
 * can't send a fake name.
 */
export function create(req: Request, res: Response) {
  const { perfumeId, station } = req.body;

  if (!perfumeId) {
    res.status(400).json({ error: "perfumeId is required" });
    return;
  }

  // Verify the perfume actually exists
  const perfume = getPerfumeById(perfumeId);
  if (!perfume) {
    res.status(404).json({ error: "Perfume not found" });
    return;
  }

  const request = StaffRequestModel.createRequest({
    perfumeId,
    perfumeName: perfume.name, // pulled from DB, not trusted from client
    station: station?.trim() || undefined,
  });

  res.status(201).json({ data: request });
}

/**
 * PATCH /api/staff-requests/:id/resolve
 *
 * Marks a request as resolved. Staff taps "Done" on the dashboard.
 * No body needed — the action is fully described by the URL.
 */
export function resolve(req: Request, res: Response) {
  const request = StaffRequestModel.resolveRequest(req.params.id as string);

  if (!request) {
    // Either doesn't exist OR was already resolved
    res.status(404).json({
      error: "Request not found or already resolved",
    });
    return;
  }

  res.json({ data: request });
}

/**
 * DELETE /api/staff-requests/:id
 *
 * Removes a request entirely (accidental tap, duplicate, etc.)
 */
export function remove(req: Request, res: Response) {
  const deleted = StaffRequestModel.deleteRequest(req.params.id as string);

  if (!deleted) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  res.status(204).send();
}
