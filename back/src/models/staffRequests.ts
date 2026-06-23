import { v4 as uuidv4 } from "uuid";
import db from "../db/connection";
import { StaffRequest } from "../types";

/**
 * Raw DB row shape for staff_requests
 */
interface StaffRequestRow {
  id: string;
  perfume_id: string;
  perfume_name: string;
  station: string | null;
  is_resolved: number;
  created_at: string;
  resolved_at: string | null;
}

function rowToRequest(row: StaffRequestRow): StaffRequest {
  return {
    id: row.id,
    perfumeId: row.perfume_id,
    perfumeName: row.perfume_name,
    station: row.station ?? undefined,
    isResolved: row.is_resolved === 1,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at ?? undefined,
  };
}

/**
 * Get all staff requests.
 * By default returns only unresolved (pending) requests.
 * Pass { includeResolved: true } to get everything (for history view).
 */
export function getAllRequests(options?: {
  includeResolved?: boolean;
}): StaffRequest[] {
  const query = options?.includeResolved
    ? "SELECT * FROM staff_requests ORDER BY created_at DESC"
    : "SELECT * FROM staff_requests WHERE is_resolved = 0 ORDER BY created_at ASC";
  // Pending requests: oldest first (ASC) so staff handle them in order
  // History: newest first (DESC)

  const rows = db.prepare(query).all() as StaffRequestRow[];
  return rows.map(rowToRequest);
}

/**
 * Create a new staff request.
 * Called when a customer taps "Ask Staff About This" on the kiosk.
 */
export function createRequest(data: {
  perfumeId: string;
  perfumeName: string;
  station?: string;
}): StaffRequest {
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO staff_requests (id, perfume_id, perfume_name, station, created_at)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(id, data.perfumeId, data.perfumeName, data.station ?? null, now);

  return rowToRequest(
    db
      .prepare("SELECT * FROM staff_requests WHERE id = ?")
      .get(id) as StaffRequestRow,
  );
}

/**
 * Mark a request as resolved.
 * Staff taps "Done" on the dashboard after helping the customer.
 * Returns null if the request ID doesn't exist.
 */
export function resolveRequest(id: string): StaffRequest | null {
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `
    UPDATE staff_requests
    SET is_resolved = 1, resolved_at = ?
    WHERE id = ? AND is_resolved = 0
  `,
    )
    .run(now, id);

  if (result.changes === 0) return null;

  return rowToRequest(
    db
      .prepare("SELECT * FROM staff_requests WHERE id = ?")
      .get(id) as StaffRequestRow,
  );
}

/**
 * Delete a request entirely (e.g. accidental tap, spam).
 */
export function deleteRequest(id: string): boolean {
  const result = db.prepare("DELETE FROM staff_requests WHERE id = ?").run(id);
  return result.changes > 0;
}

/**
 * Get a count of pending (unresolved) requests.
 * Useful for a badge/notification count on the staff dashboard.
 */
export function getPendingCount(): number {
  const row = db
    .prepare(
      "SELECT COUNT(*) as count FROM staff_requests WHERE is_resolved = 0",
    )
    .get() as { count: number };
  return row.count;
}
