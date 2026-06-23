import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import db from "../db/connection";
import { User, UserRow, CreateUserDTO } from "../types";

/**
 * Converts a raw DB row to a safe User object.
 * Critically: password_hash is NEVER included in the output.
 * This function is the firewall between "what's in the DB" and
 * "what the API ever sends to a client."
 */
function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    createdAt: row.created_at,
  };
}

/**
 * Get all users (for the admin user management screen).
 * Never returns password hashes.
 */
export function getAllUsers(): User[] {
  const rows = db
    .prepare("SELECT * FROM admin_users ORDER BY created_at ASC")
    .all() as UserRow[];
  return rows.map(rowToUser);
}

/**
 * Find a user by username.
 * Returns the FULL row including password_hash — only used internally
 * for login verification. Never pass this directly to a response.
 */
export function findByUsername(username: string): UserRow | null {
  const row = db
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get(username) as UserRow | undefined;
  return row ?? null;
}

/**
 * Find a user by ID (used to verify token is still valid).
 * Returns safe User (no hash).
 */
export function findById(id: string): User | null {
  const row = db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
  return row ? rowToUser(row) : null;
}

/**
 * Create a new user.
 *
 * bcrypt.hashSync(password, 12):
 * - The "12" is the "cost factor" (also called salt rounds).
 * - Higher = slower to compute = harder to brute force.
 * - 12 is the industry standard for 2024 — takes ~250ms on a modern CPU.
 * - We use the Sync version here because better-sqlite3 is synchronous
 *   and mixing sync DB calls with async bcrypt would complicate the flow.
 */
export function createUser(data: CreateUserDTO): User {
  const id = uuidv4();
  const passwordHash = bcrypt.hashSync(data.password, 12);
  const now = new Date().toISOString();

  try {
    db.prepare(
      `
      INSERT INTO admin_users (id, username, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    ).run(id, data.username.trim().toLowerCase(), passwordHash, data.role, now);
  } catch (err: any) {
    if (err.message?.includes("UNIQUE constraint failed")) {
      throw new Error("USERNAME_TAKEN");
    }
    throw err;
  }

  return findById(id)!;
}

/**
 * Delete a user by ID.
 * Returns false if the user didn't exist.
 *
 * Note: we prevent deleting the last admin in the controller,
 * not here — the model doesn't make business decisions.
 */
export function deleteUser(id: string): boolean {
  const result = db.prepare("DELETE FROM admin_users WHERE id = ?").run(id);
  return result.changes > 0;
}

/**
 * Verify a plain-text password against the stored hash.
 * Returns true if they match, false otherwise.
 *
 * bcrypt.compareSync is safe against timing attacks — it always
 * takes roughly the same time whether the password is right or wrong.
 */
export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

/**
 * Count how many admins exist.
 * Used to prevent deleting the last admin account (which would
 * lock everyone out of the system permanently).
 */
export function countAdmins(): number {
  const row = db
    .prepare("SELECT COUNT(*) as count FROM admin_users WHERE role = 'admin'")
    .get() as { count: number };
  return row.count;
}

/**
 * Seed a default admin if the table is completely empty.
 * Called once at startup so the system is never completely locked out.
 * Change this password immediately after first login!
 */
export function seedDefaultAdmin() {
  const existing = db
    .prepare("SELECT COUNT(*) as count FROM admin_users")
    .get() as { count: number };

  if (existing.count === 0) {
    createUser({
      username: "admin",
      password: "admin123", // ← change this on first login
      role: "admin",
    });
    console.log(
      "⚠️  Default admin created → username: admin / password: admin123",
    );
    console.log("⚠️  Change this password immediately!");
  }
}
