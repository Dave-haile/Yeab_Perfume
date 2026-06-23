import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * requireAuth — protects any route that needs a logged-in user.
 *
 * How it works:
 * 1. Reads the Authorization header: "Bearer <token>"
 * 2. Strips the "Bearer " prefix to get the raw token
 * 3. Verifies the token's signature using JWT_SECRET
 *    - If the secret doesn't match → token was forged → 401
 *    - If the token is expired → 401
 *    - If valid → decodes the payload ({ id, username, role })
 * 4. Attaches the payload to req.user
 * 5. Calls next() so the controller runs
 *
 * Any controller after this middleware can safely read req.user
 * and trust it — it's been cryptographically verified.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }

  const authHeader = req.headers.authorization;

  // Header must exist and start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.slice(7); // remove "Bearer " prefix

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload; // attach to request for downstream use
    next();
  } catch (err: any) {
    // jwt.verify throws for expired or invalid tokens
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expired, please log in again" });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}

/**
 * requireAdmin — role guard, ALWAYS used after requireAuth.
 *
 * requireAuth confirms the user is logged in.
 * requireAdmin then confirms they're specifically an admin.
 *
 * Usage on a route:
 *   router.post("/users", requireAuth, requireAdmin, controller)
 *                              ↑              ↑
 *                         is logged in?   is admin?
 *
 * Why separate middleware instead of one combined function?
 * Because "logged in" and "is admin" are two different checks —
 * keeping them separate lets you mix and match per route.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    // Shouldn't happen if requireAuth ran first, but defensive check
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    // 401 = not authenticated (who are you?)
    // 403 = not authorized (I know who you are, but you can't do this)
    return;
  }

  next();
}
