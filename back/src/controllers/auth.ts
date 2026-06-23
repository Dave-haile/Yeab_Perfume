import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/users";
import { LoginDTO, JwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

/**
 * POST /api/auth/login
 *
 * Body: { username: string, password: string }
 *
 * Flow:
 * 1. Find user by username
 * 2. Verify password against stored bcrypt hash
 * 3. Sign a JWT with the user's id, username, and role
 * 4. Return the token + user info (no password hash ever)
 *
 * Security: we return the SAME error message whether the username
 * doesn't exist OR the password is wrong. This prevents "username
 * enumeration" — an attacker figuring out which usernames exist
 * by seeing different error messages.
 */
export function login(req: Request, res: Response) {
  const { username, password } = req.body as LoginDTO;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  // findByUsername returns the full row including password_hash
  const userRow = UserModel.findByUsername(username.trim().toLowerCase());

  if (!userRow || !UserModel.verifyPassword(password, userRow.password_hash)) {
    // Same message for both cases — intentional
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  // Build the JWT payload — only include what's needed
  const payload: JwtPayload = {
    id: userRow.id,
    username: userRow.username,
    role: userRow.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  res.json({
    token,
    user: {
      id: userRow.id,
      username: userRow.username,
      role: userRow.role,
    },
  });
}

/**
 * GET /api/auth/me
 *
 * Protected route — requireAuth middleware runs first.
 * Returns the current user's info from the JWT payload.
 *
 * The frontend calls this on app load to check if the stored
 * token is still valid and to get the current user's role.
 */
export function me(req: Request, res: Response) {
  // req.user is guaranteed to exist here because requireAuth ran first
  const user = UserModel.findById(req.user!.id);

  if (!user) {
    // Token was valid but user was deleted from DB since token was issued
    res.status(401).json({ error: "User no longer exists" });
    return;
  }

  res.json({ user });
}
